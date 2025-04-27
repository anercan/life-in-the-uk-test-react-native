import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView} from 'react-native';
import {IAnswerResponse, IQuizQuestion} from "constants/types";
import {useTheme} from "../hooks";
import {AppText} from "./index";
import Animated, {FadeIn} from "react-native-reanimated";
import SwipeIndicator from "components/SwipeIndicator";
import {useTap} from "hooks/useTap";

const {height, width} = Dimensions.get('window');

const QuizQuestion = (props: IQuizQuestion) => {
    const {onTouchStart, onTouchEnd} = useTap(() => triggerTap());
    const {fonts, sizes, colors} = useTheme();
    const [selectedId, setSelectedId] = useState<number>();

    useEffect(() => {
        if (props.selectedId != null && props.selectedId !== 0) {
            setSelectedId(props.selectedId);
        }
    }, [props.id]);

    const handleSelect = (answer: IAnswerResponse) => {
        setSelectedId(answer.id);
        props.onSelect(answer.id);
    }

    const getBackgroundColor = (id: number) => {
        if (!props.isAnswered) {
            return colors.orderBoxBackGround; // cevaplanmamışsa, varsayılan renk
        }
        let selectedAnswer = id === selectedId;
        if (selectedAnswer) {
            return id === props.correctAnswerId ? '#75c78a' : '#c97d80'; // doğru cevap yeşil, yanlış kırmızı
        }
        return id === props.correctAnswerId && (props.isReviewPage || props.showCorrectAnswer) ? '#75c78a' : colors.orderBoxBackGround; // doğru cevap yeşil, geri kalan gri
    }

    const triggerTap = () => {
        if (props.isAnswered) {
            props.onSkipTap();
        }
    }

    const styles = StyleSheet.create({
        box: {
            borderWidth: 1,
            borderColor: colors.cardBorder,
            padding: sizes.s,
            paddingBottom: sizes.m,
            borderRadius: sizes.m,
            margin: sizes.s,
            marginTop: sizes.m,
            marginBottom: sizes.l,
            alignItems: 'center',
            backgroundColor: colors.card,
            shadowColor: colors.shadow,
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 5,
        }, orderBox: {
            height: sizes.xl,
            width: sizes.xl,
            justifyContent: 'center',
            borderRadius: sizes.xxl,
            backgroundColor: colors.tabBackground,
            shadowColor: colors.shadow,
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 3,
            marginTop: -sizes.md
        },
        questionBox: {
            borderWidth: 1,
            borderColor: colors.cardBorder,
            width: width / 1.2,
            padding: sizes.m,
            borderRadius: sizes.sm,
            marginTop: sizes.sm,
            marginHorizontal: sizes.s,
            marginBottom: sizes.l,
            backgroundColor: colors.tabBackground,
            shadowColor: colors.shadow,
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 4,
        }, explanationBox: {
            marginTop: sizes.s,
            width: sizes.base * 42,
            padding: sizes.s,
        },
        answerBox: {
            borderWidth: 1,
            borderColor: colors.cardBorder,
            flexDirection: 'row',
            width: sizes.base * 43,
            paddingVertical: sizes.base * 1.3,
            paddingHorizontal: sizes.sm,
            borderRadius: sizes.sm,
            marginVertical: sizes.s,
            margin: sizes.s,
            shadowColor: colors.shadow,
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        }, questionText: {
            fontFamily: fonts.p,
            color: colors.text,
            fontSize: sizes.text
        }, explanationText: {
            fontFamily: fonts.text,
            color: colors.text,
            fontSize: sizes.text,
            marginTop: sizes.xs
        }, orderText: {
            fontFamily: fonts.h1,
            textAlign: "center",
            color: colors.text,
            fontSize: sizes.h2
        }, answerText: {
            color: colors.text,
            fontFamily: fonts.text,
            fontSize: sizes.text
        }
    });

    const answers = (answerList: IAnswerResponse[]) => {
        if (props.isReviewPage) {
            answerList = answerList?.filter(answer => {
                const answeredCorrectly = props?.correctAnswerId === selectedId;
                return answeredCorrectly || answer.id === selectedId || answer.id === props.correctAnswerId;
            })
        }

        return answerList?.map((answer) => (
            <TouchableOpacity
                disabled={props.isAnswered}
                key={answer.id}
                onPress={() => handleSelect(answer)}>
                <View style={{...styles.answerBox, backgroundColor: getBackgroundColor(answer.id)}}>
                    <Text style={styles.answerText}>{answer.content}</Text>
                </View>
            </TouchableOpacity>
        ));
    };

    return (
        <ScrollView style={{marginBottom: sizes.md, marginTop: height / 30}}>
            <View onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={styles.box}>
                <View style={styles.orderBox}>
                    <Text
                        style={styles.orderText}>{props?.questionOrder || props?.questionOrder == 0 ? props?.questionOrder + 1 : null}</Text>
                </View>
                <View style={styles.questionBox}>
                    <Text style={styles.questionText}>{props.content}</Text>
                </View>
                {answers(props.answersList)}
                {(props.isAnswered && props.selectedId != props.correctAnswerId && props.explanation?.trim()?.length > 0) ?
                    <Animated.View entering={FadeIn} style={styles.explanationBox}>
                        <AppText h4>
                            Explanation
                        </AppText>
                        <Text style={styles.explanationText}>
                            {props.explanation}
                        </Text>
                    </Animated.View>
                    : ''
                }
                {(props.questionOrder == 0 && !props.isReviewPage && props.isAnswered) &&
                    <SwipeIndicator/>
                }
            </View>
        </ScrollView>
    );
}

export default QuizQuestion;
