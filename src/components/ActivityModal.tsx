import React, {useEffect, useState} from "react";
import {hexWithOpacity} from "util/commonUtil";
import useApiCaller from "hooks/useApiCaller";
import {useTheme} from "hooks";
import {ActivityData} from "screens/Profile";
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {ContributionGraph} from "react-native-chart-kit";

const {height, width} = Dimensions.get('window');

const ActivityModal = ({navigation, modalVisible, onPressClose}) => {
    const {apiCaller} = useApiCaller(navigation);
    const {sizes, colors, fonts} = useTheme();
    const [activityData, setActivityData] = useState<ActivityData[]>([]);

    useEffect(() => {
        if (modalVisible) {
            apiCaller('profile/get-user-activity-data')
                .then((response: any) => {
                    if (response?.activityDataList) {
                        let activityDataList: ActivityData[] = [];
                        response?.activityDataList.forEach((data: ActivityData) => {
                            activityDataList.push({
                                count: getCount(data),
                                date: data.date
                            } as ActivityData);
                        });
                        setActivityData(activityDataList)
                    }
                });
        }
    }, [modalVisible]);

    const getCount = (data: ActivityData) => {
        if (data?.count) {
            if (data.count == 0) {
                return 0;
            } else if (data.count > 0) {
                return 1;
            }
        }
        return 0;
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            padding: 20,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContainer: {
            width: '95%',
            height: '40%',
            backgroundColor: colors.secondaryBackground,
            borderRadius: sizes.s,
            padding: sizes.sm,
            alignItems: 'center',
        }
    });

    return (
        <View style={styles.container}>
            <Modal
                visible={modalVisible}
                animationType='fade'
                transparent={true}
                onRequestClose={() => onPressClose()}
            >
                <TouchableWithoutFeedback onPress={() => onPressClose()}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={{flex: 1}}>
                                <Text style={{
                                    fontFamily: fonts.text,
                                    fontSize: sizes.text,
                                    color: colors.text,
                                    textAlign: 'center'
                                }}>Activity (Last 3 Months)</Text>
                                <View style={{marginTop:sizes.m}}>
                                    <ContributionGraph
                                        values={activityData}
                                        endDate={new Date()}
                                        numDays={90}
                                        accessor={"count"}
                                        squareSize={height / 45}
                                        width={width / 1.25}
                                        height={height / 4}
                                        chartConfig={{
                                            backgroundGradientFrom: colors.secondaryBackground.toString(),
                                            backgroundGradientTo: colors.secondaryBackground.toString(),
                                            color: (opacity = 1) => hexWithOpacity(colors.primary, opacity),
                                            labelColor: (opacity = 1) => hexWithOpacity(colors.text, opacity),
                                        }}
                                        tooltipDataAttrs={() => {
                                            return {rx: 8, ry: 8};
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

export default ActivityModal;

