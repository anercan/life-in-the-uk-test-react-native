import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import * as Progress from 'react-native-progress';

import useTheme from '../hooks/useTheme';

export interface IScoreCard {
    total: number;
    correct: number;
    wrong: number;
    quizName: string;
}

const ScoreCard = (props: IScoreCard) => {
    const {fonts, colors, sizes} = useTheme();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setProgress(props.correct / props.total);
    }, [progress]);

    const styles = StyleSheet.create({
        container: {
            borderWidth: 1,
            borderColor: colors.cardBorder,
            marginBottom: sizes.xl,
            backgroundColor: colors.card,
            elevation: 2,
            shadowColor:colors.shadow,
            shadowOffset: {width: 0, height: 3},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            borderRadius: sizes.m,
            padding: sizes.sm,
            width: '95%',
        }, progress: {
            borderRadius: sizes.xxxl, backgroundColor: colors.primary, elevation: 2
        }, scoreBox: {
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            backgroundColor: colors.tabBackground,
            borderRadius: sizes.s,
            marginHorizontal: sizes.s,
            paddingBottom: sizes.xs
        }, scoreBoxContainer: {
            borderWidth: 1,
            borderColor: colors.cardBorder,
            borderRadius: sizes.sm,
            paddingVertical:sizes.xs,
            flexDirection: 'row',
            flex: 1,
            backgroundColor: colors.tabBackground,
            marginHorizontal: sizes.s
        }, scoreText: {
            color: colors.text, fontSize: sizes.h2, fontFamily: fonts.p,
        },
    });

    const getScoreText = () => {
        return Math.round(props.correct * 100 / props.total) + '%';
    }

    return (
        <View style={styles.container}>
            <View style={{alignItems: 'center', marginBottom: sizes.m}}>
                <Text style={{textAlign: 'center', color: colors.text, fontSize: sizes.h2, fontFamily: fonts.medium}}>
                    {props.quizName}
                </Text>
            </View>
            <View style={{alignItems: 'center', marginBottom: sizes.md}}>
                <View style={styles.progress}>
                    <Progress.Circle
                        animated={true}
                        borderWidth={0}
                        textStyle={{fontFamily: fonts.p, fontSize: sizes.h1}}
                        thickness={sizes.sm}
                        color={'#eeeeee'}
                        showsText={true}
                        formatText={() => getScoreText()}
                        size={sizes.base * 20}
                        progress={progress}/>
                </View>
            </View>
            <View style={styles.scoreBoxContainer}>
                <View style={styles.scoreBox}>
                    <Text style={{...styles.scoreText}}>{props.total}</Text>
                    <Text style={{...styles.scoreText, color: colors.text, fontSize: sizes.p}}>{'Total'}</Text>
                </View>
                <View style={styles.scoreBox}>
                    <Text style={{...styles.scoreText}}>{props.correct}</Text>
                    <Text style={{...styles.scoreText, color: colors.text, fontSize: sizes.p}}>{'Correct'}</Text>
                </View>
                <View style={styles.scoreBox}>
                    <Text style={{...styles.scoreText}}>{props.wrong}</Text>
                    <Text style={{...styles.scoreText, color: colors.text, fontSize: sizes.p}}>{'Wrong'}</Text>
                </View>
            </View>
        </View>

    )
}
export default ScoreCard;
