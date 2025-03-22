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
            marginBottom: sizes.xl,
            backgroundColor: '#d8d8d9',
            elevation: 4,
            borderRadius: sizes.s,
            padding: sizes.s,
            width: '95%',
        }, progress: {
            borderRadius: sizes.xxxl, backgroundColor: colors.primary, elevation: 2
        }, scoreBox: {
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            backgroundColor: '#ccccce',
            borderRadius: sizes.s,
            marginHorizontal: sizes.s,
            paddingBottom: sizes.xs
        }, scoreBoxContainer: {
            borderColor: colors.primary,
            borderRadius: sizes.sm,
            flexDirection: 'row',
            flex: 1,
            backgroundColor: '#ccccce',
            marginHorizontal: sizes.s
        }, scoreText: {
            color: '#4e4d4d', fontSize: sizes.h2, fontFamily: fonts.p,
        },
    });

    const getScoreText = () => {
        return Math.round(props.correct * 100 / props.total) + '%';
    }

    return (
        <View style={styles.container}>
            <View style={{alignItems: 'center', marginBottom: sizes.m}}>
                <Text style={{textAlign: 'center', color: '#565758', fontSize: sizes.h1, fontFamily: fonts.p}}>
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
                    <Text style={{...styles.scoreText, color: '#5e5d5d', fontSize: sizes.p}}>{'Total'}</Text>
                </View>
                <View style={styles.scoreBox}>
                    <Text style={{...styles.scoreText}}>{props.correct}</Text>
                    <Text style={{...styles.scoreText, color: '#5e5d5d', fontSize: sizes.p}}>{'Correct'}</Text>
                </View>
                <View style={styles.scoreBox}>
                    <Text style={{...styles.scoreText}}>{props.wrong}</Text>
                    <Text style={{...styles.scoreText, color: '#5e5d5d', fontSize: sizes.p}}>{'Wrong'}</Text>
                </View>
            </View>
        </View>

    )
}
export default ScoreCard;
