import React, {useEffect, useState} from 'react';
import {PieChart} from "react-native-gifted-charts";
import {useTheme} from '../hooks/';
import {TouchableOpacity, View} from "react-native";
import StatusBox from "components/StatusBox";
import {AppText} from "components/index";

const DataDistributionCard = ({propData, isLoadingProp}) => {
    const [dataList, setDataList] = useState<any[]>();
    const {sizes, colors, fonts} = useTheme();
    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setDataList(propData);
        setLoading(isLoadingProp);
    }, [propData]);

    const focusPressed = (index: number) => {
        setDataList(prevList => prevList.map((item, i) => ({...item, focused: i === index})));
    }

    const renderLegendComponent = () => {
        return (
            dataList?.length > 0 &&
            dataList.map((data, index) => (
                <TouchableOpacity key={'t' + index} onPress={() => focusPressed(index)}
                                  style={{
                                      flexDirection: 'row',
                                      alignItems: 'center'
                                  }}>
                    <View
                        style={{
                            height: sizes.sm,
                            width: sizes.sm,
                            borderRadius: sizes.xs,
                            backgroundColor: data?.color,
                            marginRight: sizes.s,
                        }}
                    />
                    <AppText style={{
                        marginVertical: sizes.xs,
                        fontFamily: data.focused ? fonts.bold : fonts.text,
                        fontSize: sizes.smallText
                    }}>{data?.name}</AppText>
                </TouchableOpacity>
            ))
        );
    };

    return (
        <View style={{paddingVertical: sizes.m, flex: 1}}>
            {!isLoading ? dataList?.length > 0 ?
                    <View style={{
                        borderWidth: 1,
                        borderColor: colors.cardBorder,
                        backgroundColor: colors.card,
                        padding: sizes.sm,
                        borderRadius: sizes.sm,
                    }}>
                        <AppText style={{fontFamily: fonts.semibold}}>
                            Incorrect Distribution
                        </AppText>
                        <View style={{marginVertical: 30, alignItems: 'center'}}>
                            <PieChart
                                focusOnPress
                                data={dataList}
                                donut
                                onPress={(_val, index) => focusPressed(index)}
                                //showGradient
                                sectionAutoFocus
                                radius={120}
                                innerRadius={70}
                                innerCircleColor={colors.card}
                                centerLabelComponent={() => {
                                    return (
                                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                            <AppText style={{fontSize: sizes.h1, fontFamily: fonts.semibold}}>
                                                {dataList.find(value => value.focused === true)?.value}
                                            </AppText>
                                            <AppText style={{
                                                fontSize: sizes.smallestText,
                                                color: colors.text,
                                                textAlign: 'center'
                                            }}>
                                                Incorrect Answers
                                            </AppText>
                                        </View>
                                    );
                                }}
                            />
                        </View>
                        {renderLegendComponent()}
                    </View>
                    :
                    <StatusBox text={'Start solving to monitor analytics data!'}/>
                :
                <View style={{alignItems: 'center'}}>
                    {/*
                    <Instagram width={width / 1.1} color={colors.secondaryBackground}/>
*/}
                </View>
            }
        </View>
    );
};
export default DataDistributionCard;
