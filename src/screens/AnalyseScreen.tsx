import React, {useContext, useEffect, useState} from 'react';
import {PieChart} from "react-native-gifted-charts";
import {Instagram} from 'react-content-loader/native'
import {useTheme} from '../hooks/';
import {Dimensions, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {TitleContext} from "context/TitleContext";
import useApiCaller from "../hooks/useApiCaller";
import {
    capitalizeWords,
    getColorFromPalette,
    getShortenText,
} from "util/commonUtil";
const {width} = Dimensions.get('window');

const AnalyseScreen = ({navigation}) => {
    const {apiCaller} = useApiCaller(navigation);
    const [incorrectList, setIncorrectList] = useState<any[]>([]);
    const {sizes, colors,fonts} = useTheme();
    const {setTitle} = useContext(TitleContext);

    useEffect(() => {
        setTitle('Analyse Report')
        apiCaller('profile/get-user-quiz-analyses')
            .then((response: any) => {
                if (response?.wrongsMap) {
                    let incorrectDataList: any[] = [];
                    let wrongsMap = response.wrongsMap;
                    const maxIncorrectKey = Object.entries(wrongsMap)?.reduce((max, entry) => Number(entry[1]) > Number(max[1]) ? entry : max)[0];
                    Object.entries(wrongsMap).forEach(([key, val], index) => {
                        incorrectDataList.push({
                            focused: maxIncorrectKey === key,
                            name: getShortenText(capitalizeWords(key), 50),
                            value: val,
                            color: getColorFromPalette(index),
                        });
                    });
                    setIncorrectList(incorrectDataList);
                }
            });
    }, []);

    const focusPressed = (index: number) => {
        setIncorrectList(prevList =>
            prevList.map((item, i) => ({
                ...item,
                focused: i === index,
            }))
        );
    }

    const renderLegendComponent = () => {
        return (
            incorrectList?.length > 0 &&
            incorrectList.map((data, index) => (
                <>
                    <TouchableOpacity onPress={() => focusPressed(index)}
                                      style={{
                                          flexDirection: 'row',
                                          alignItems: 'center'
                                      }}>
                        <View
                            style={{
                                height: sizes.sm,
                                width:  sizes.sm,
                                borderRadius: sizes.xs,
                                backgroundColor: data?.color,
                                marginRight: sizes.s,
                            }}
                        />
                        <Text style={{
                            marginVertical:sizes.xs,
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
        <ScrollView contentContainerStyle={{ marginVertical: sizes.m}}>
            <View style={{paddingVertical: sizes.m, paddingHorizontal: sizes.m, flex: 1,width:'98%'}}>
                {incorrectList?.length > 0 ?
                    <View style={{padding: sizes.sm, borderRadius: sizes.sm, backgroundColor: colors.card}}>
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
                                data={incorrectList}
                                donut
                                onPress = { (_val,index) => focusPressed(index) }
                                //showGradient
                                sectionAutoFocus
                                radius={120}
                                innerRadius={70}
                                innerCircleColor={colors.card}
                                centerLabelComponent={() => {
                                    return (
                                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{fontSize: sizes.h1,fontFamily:fonts.semibold, color: colors.text,}}>
                                                {incorrectList.find(value => value.focused === true)?.value}
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
                    <Instagram width={width/1.1} color={colors.secondaryBackground}/>
                }
            </View>
        </ScrollView>
    );
};


export default AnalyseScreen;
