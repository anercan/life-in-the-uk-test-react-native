import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import * as Progress from 'react-native-progress';

import useTheme from '../hooks/useTheme';
import {isDailyQuiz} from "util/quizUtils";

export interface IScoreCard {
    total: number;
    correct: number;
    wrong: number;
    quizName: string;
    onPress: (reviewType: string) => void;
    quizType: string;
}

const ScoreCard = (props: IScoreCard) => {
    const {fonts, colors, sizes} = useTheme();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (props?.total) {
            setProgress(props.correct / props.total);
        }
    }, [progress]);

    const styles = StyleSheet.create({
        container: {
            borderWidth: 1,
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
        }, progress: {
            borderRadius: sizes.xxxl, backgroundColor: colors.primary, elevation: 2,
            shadowColor: colors.shadow,
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.2,
            shadowRadius: sizes.shadowRadius,
        }, scoreBox: {
            elevation: 2,
            shadowColor: colors.shadow,
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.2,
            shadowRadius: sizes.shadowRadius,
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            backgroundColor: colors.tabBackground,
            borderRadius: sizes.s,
            marginHorizontal: sizes.xs,
            paddingBottom: sizes.xs
        }, scoreBoxContainer: {
            flexDirection: 'row',
            flex: 1,
            marginHorizontal: sizes.s
        }, scoreText: {
            color: colors.text, fontSize: sizes.h2, fontFamily: fonts.p,
        },
    });

    const getScoreText = () => {
        try {
            if (props?.total) {
                return Math.round(props?.correct * 100 / props?.total) + '%';
            }
            return '0%';
        } catch (e) {
            return '0%';
        }
    }

    const onPressScore = (reviewType) => {
        if (!isDailyQuiz(props.quizType)) {
            props.onPress(reviewType);
        }
    }

    const getActiveOpacity = () => {
        return isDailyQuiz(props.quizType) ? 1 : 0.4;
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
                <TouchableOpacity activeOpacity={getActiveOpacity()} onPress={() => onPressScore('REVIEW_ALL')}
                                  style={styles.scoreBox}>
                    <Text style={{...styles.scoreText}}>{props.total}</Text>
                    <Text style={{...styles.scoreText, color: colors.text, fontSize: sizes.p}}>{'Total'}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={getActiveOpacity()} onPress={() => onPressScore('REVIEW_CORRECTS')}
                                  style={styles.scoreBox}>
                    <Text style={{...styles.scoreText}}>{props.correct}</Text>
                    <Text style={{...styles.scoreText, color: colors.text, fontSize: sizes.p}}>{'Correct'}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={getActiveOpacity()} onPress={() => onPressScore('REVIEW_WRONGS')}
                                  style={styles.scoreBox}>
                    <Text style={{...styles.scoreText}}>{props.wrong}</Text>
                    <Text style={{...styles.scoreText, color: colors.text, fontSize: sizes.p}}>{'Wrong'}</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}
export default ScoreCard;
