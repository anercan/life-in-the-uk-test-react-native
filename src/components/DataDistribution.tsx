import React, {useEffect, useState} from 'react';
import {PieChart} from "react-native-gifted-charts";
import {Instagram} from 'react-content-loader/native'
import {useTheme} from '../hooks/';
import {Dimensions, Text, TouchableOpacity, View} from "react-native";

const {width} = Dimensions.get('window');

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
                <>
                    <TouchableOpacity key={'t'+index} onPress={() => focusPressed(index)}
                                      style={{
                                          flexDirection: 'row',
                                          alignItems: 'center'
                                      }}>
                        <View key={'v'+index}
                            style={{
                                height: sizes.sm,
                                width: sizes.sm,
                                borderRadius: sizes.xs,
                                backgroundColor: data?.color,
                                marginRight: sizes.s,
                            }}
                        />
                        <Text key={'text'+index} style={{
                            marginVertical: sizes.xs,
                            fontFamily: data.focused ? fonts.bold : fonts.text,
                            color: colors.text,
                            fontSize: sizes.smallText
                        }}>{data?.name}</Text>
                    </TouchableOpacity>
                </>
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
                        elevation: 2,
                        shadowColor: colors.shadow,
                        shadowOffset: {width: 0, height: 0},
                        shadowOpacity: 0.2,
                        shadowRadius: sizes.shadowRadius,
                    }}>
                        <Text style={{
                            fontFamily: fonts.semibold,
                            textAlign: 'center',
                            color: colors.text,
                            fontSize: sizes.text
                        }}>
                            Incorrect Distribution
                        </Text>
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
                                            <Text style={{
                                                fontSize: sizes.h1,
                                                fontFamily: fonts.semibold,
                                                color: colors.text,
                                            }}>
                                                {dataList.find(value => value.focused === true)?.value}
                                            </Text>
                                            <Text style={{fontSize: sizes.smallestText, color: colors.text}}>Incorrect Answers</Text>
                                        </View>
                                    );
                                }}
                            />
                        </View>
                        {renderLegendComponent()}
                    </View>
                    :
                    <Text style={{textAlign: 'center'}}>{'Start solving to monitor analytics data!'}</Text>
                :
                <View style={{alignItems: 'center'}}>
                    <Instagram width={width / 1.1} color={colors.secondaryBackground}/>
                </View>
            }
        </View>
    );
};
export default DataDistributionCard;
