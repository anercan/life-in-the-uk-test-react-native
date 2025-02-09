import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView} from 'react-native';
import {IAnswerResponse, IQuizQuestion} from "../constants/types";
import {useTheme} from "../hooks";
import Image from "./Image";
import {AppText} from "./index";

const {width} = Dimensions.get('window');

const QuizQuestion = (props: IQuizQuestion) => {
    const {fonts,sizes,colors} = useTheme();
    const [isAnswered, setAnswered] = useState(false);
    const [selectedId, setSelectedId] = useState<number>();

    useEffect(() => {
        setAnswered(props.isAnswered);
        if (props.selectedId != null && props.selectedId !== 0) {
            setSelectedId(props.selectedId);
        }
    }, [props.id]);

    const handleSelect = (answer: IAnswerResponse) => {
        setAnswered(true);
        setSelectedId(answer.id);
        props.onSelect(answer.id);
    }

    const getBackgroundColor = (id: number) => {
        if (!props.isAnswered) {
            return '#e0dbda'; // cevaplanmamışsa, varsayılan renk
        }
        let selectedAnswer = id === selectedId;
        if (selectedAnswer) {
            return id === props.correctAnswerId ? '#45975c' : '#bf5c63'; // doğru cevap yeşil, yanlış kırmızı
        }
        return id === props.correctAnswerId ? '#45975c' : '#e0dbda'; // doğru cevap yeşil, geri kalan gri
    }

    const styles = useMemo(() => StyleSheet.create({
        box: {
            padding: sizes.s,
            paddingBottom:sizes.m,
            borderRadius: sizes.sm,
            margin: sizes.s,
            marginTop: sizes.sm,
            marginBottom: sizes.l,
            alignItems:'center',
            backgroundColor: '#e5e5e5',
            shadowColor: '#363535',
            shadowOffset: {width: 0, height: 5},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 5,
        }, orderBox: {
            height: sizes.xl,
            width: sizes.xl,
            justifyContent: 'center',
            borderRadius: sizes.xxl,
            backgroundColor: '#d9d9d9',
            shadowColor: '#898989',
            shadowOffset: {width: 0, height: 3},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 1,
            marginTop: -sizes.m
        },
        questionBox: {
            width: width / 1.2,
            padding: sizes.m,
            borderRadius: sizes.s,
            margin: sizes.s,
            marginBottom: props.explanation && props.isReviewPage ? sizes.l : sizes.xl,
            backgroundColor: '#c1c0c0',
            shadowColor: '#363535',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 5,
        }, explanationBox: {
            marginTop:sizes.s,
            width: sizes.base * 42,
            padding: sizes.s,
        },
        answerBox: {
            width: sizes.base * 43,
            padding: sizes.s,
            borderRadius: sizes.s,
            margin: sizes.s,
            shadowColor: '#363535',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 3,
        }, questionText: {
            fontFamily: fonts.p,
            color: '#363535',
            fontSize: sizes.text
        }, explanationText: {
            fontFamily: fonts.text,
            color: '#363535',
            fontSize: sizes.text,
            marginTop:sizes.xs
        }, orderText: {
            fontFamily: fonts.h1,
            textAlign: "center",
            color: '#474646',
            fontSize: sizes.h2
        }, answerText: {
            color:'#3b3b3b',
            fontFamily: fonts.text,
            fontSize: sizes.text
        }
    }),[props.explanation,props.isReviewPage]);

    const answers = (answerList: IAnswerResponse[]) => {
        if (props.isReviewPage) {
            answerList = answerList?.filter(answer => answer.id === selectedId || answer.id === props.correctAnswerId)
        }

        return answerList?.map((answer) => (
            <TouchableOpacity
                disabled={isAnswered}
                key={answer.id}
                onPress={() => handleSelect(answer)}>
                <View style={{...styles.answerBox, backgroundColor: getBackgroundColor(answer.id)}}>
                    <Text style={styles.answerText}>{answer.content}</Text>
                </View>
            </TouchableOpacity>
        ));
    };

    return (
        <>
            <ScrollView style={{marginBottom:sizes.md}}>
                <View style={styles.box}>
                    <View style={styles.orderBox}>
                        <Text style={styles.orderText}>{props?.questionOrder || props?.questionOrder == 0  ? props?.questionOrder + 1 : null}</Text>
                    </View>
                    <View style={styles.questionBox}>
                        <Text style={styles.questionText}>{props.content}</Text>
                    </View>
                    {answers(props.answersList)}
                    { (props.questionOrder == 0 && !props.isReviewPage && isAnswered) &&
                        <View>
                            <Image
                                width={sizes.xxl}
                                height={sizes.xxl}
                                marginTop={sizes.m}
                                marginBottom={sizes.sm}
                                color={colors.primary}
                                source={require('../assets/images/swipe.png')}
                            />
                        </View>
                    }
                    {(props.isReviewPage && props.explanation?.trim()?.length > 0) ?
                        <View style={styles.explanationBox}>
                            <AppText h4>
                                Explanation
                            </AppText>
                            <Text style={styles.explanationText}>
                                {props.explanation}
                            </Text>
                        </View>
                        : ''
                    }
                </View>
            </ScrollView>

        </>
    );
}

export default QuizQuestion;
