import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import useTheme from '../hooks/useTheme';
import {capitalizeWords, getColorFromPalette, getShortenText, hexWithOpacity} from "util/commonUtil";
import {PieChart} from "react-native-chart-kit";

const DataDistributionCard = ({incorrectMapProps}) => {
    const {fonts, colors, sizes} = useTheme();
    const [incorrectMap, setIncorrectMap] = useState<any[]>([]);

    useEffect(() => {
        if (incorrectMapProps) {
            let incorrectDataList: any[] = [];
            Object.entries(incorrectMapProps).forEach(([key, value], index) => {
                incorrectDataList.push({
                    name: '- ' + getShortenText(capitalizeWords(key), 24),
                    incorrectCount: value,
                    color: getColorFromPalette(index),
                    legendFontColor: colors.light,
                    legendFontSize: sizes.smallestText
                } as any);
            });
            setIncorrectMap(incorrectDataList);
        }
    }, [incorrectMapProps]);

    const styles = StyleSheet.create({
        container: {
            borderWidth: 1,
            justifyContent: 'center',
            borderColor: colors.cardBorder,
            marginBottom: sizes.xl,
            backgroundColor: colors.card,
            elevation: 2,
            shadowColor: colors.shadow,
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.2,
            shadowRadius: sizes.shadowRadius,
            borderRadius: sizes.m,
            padding: sizes.sm,
            width: '95%',
        }
    });

    return (
        <View style={styles.container}>
            <View>
                <Text style={{fontFamily: fonts.medium, color: colors.text, textAlign: 'center', fontSize: sizes.h3}}>Incorrect Answers Distribution</Text>
            </View>
            <PieChart
                data={incorrectMap}
                width={sizes.base * 50}
                height={sizes.xxxxl}
                chartConfig={{
                    color: (opacity = 1) => hexWithOpacity(colors.text, opacity),
                }}
                accessor={"incorrectCount"}
                backgroundColor={"transparent"}
                center={[sizes.xl, -sizes.xs]}
                absolute
                paddingLeft={-sizes.xxl + ""}
            />
        </View>

    )
}
export default DataDistributionCard;
