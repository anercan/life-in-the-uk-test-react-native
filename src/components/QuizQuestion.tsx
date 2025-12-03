import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {IAnswerResponse, IQuizQuestion} from "constants/types";
import {useTheme} from "../hooks";
import Animated, {FadeIn} from "react-native-reanimated";
import SwipeIndicator from "components/SwipeIndicator";
import {useTap} from "hooks/useTap";
import {AppText} from "components/index";

const {width} = Dimensions.get('window');

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
        const dontHighlightCorrect = !props.showCorrectAnswer && !props.isReviewPage;
        let selectedAnswer = id === selectedId;
        if (selectedAnswer) {
            if (dontHighlightCorrect) {
                return colors.light;
            }
            return id === props.correctAnswerId ? '#75c78a' : '#c97d80'; // doğru cevap yeşil, yanlış kırmızı
        } else {
            if (!dontHighlightCorrect && id === props.correctAnswerId) {
                return '#75c78a'
            } else {
                return colors.orderBoxBackGround
            }
        }
    }

    const triggerTap = () => {
        if (props.isAnswered) {
            props.onSkipTap();
        }
    }

    const styles = StyleSheet.create({
        box: {
            flex: 1,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            padding: sizes.s,
            paddingBottom: sizes.sm,
            borderRadius: sizes.m,
            marginHorizontal: sizes.sm,
            alignItems: 'center',
            backgroundColor: colors.card,
        }, orderBox: {
            height: sizes.xl,
            width: sizes.xl,
            justifyContent: 'center',
            borderRadius: sizes.xxl,
            backgroundColor: colors.tabBackground,
            marginTop: -sizes.md,
            borderWidth: 1,
            borderColor: colors.cardBorder,
        },
        questionBox: {
            borderWidth: 1,
            borderColor: colors.cardBorder,
            width: width / 1.2,
            padding: sizes.m,
            borderRadius: sizes.sm,
            marginTop: sizes.sm,
            marginBottom: sizes.l,
            backgroundColor: colors.tabBackground,
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
        }, questionText: {
            fontFamily: fonts.p
        }, explanationText: {
            textAlign: 'auto',
            marginTop: sizes.xs
        }, orderText: {
            fontFamily: fonts.h1,
            fontSize: sizes.h2
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
                activeOpacity={0.6}
                key={answer.id}
                onPress={() => handleSelect(answer)}>
                <View style={{...styles.answerBox, backgroundColor: getBackgroundColor(answer.id)}}>
                    <AppText style={{textAlign: 'auto'}}>{answer.content}</AppText>
                </View>
            </TouchableOpacity>
        ));
    };

    const showSwipeIndicator = () => {
        return props?.questionOrder == 0 && !props?.isReviewPage && props?.isAnswered;
    }

    return (
        <View onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={styles.box}>
            <View style={styles.orderBox}>
                <AppText
                    style={styles.orderText}>{props?.questionOrder || props?.questionOrder == 0 ? props?.questionOrder + 1 : null}</AppText>
            </View>
            <View style={styles.questionBox}>
                <AppText style={styles.questionText}>{props.content}</AppText>
            </View>
            {answers(props.answersList)}
            {(props.isAnswered && props.selectedId != props.correctAnswerId && props.explanation?.trim()?.length > 0) ?
                <Animated.View entering={FadeIn} style={styles.explanationBox}>
                    <AppText style={styles.explanationText}>
                        {props.explanation}
                    </AppText>
                </Animated.View>
                : ''
            }
            {showSwipeIndicator() && <SwipeIndicator/>}
        </View>
    );
}

export default QuizQuestion;
