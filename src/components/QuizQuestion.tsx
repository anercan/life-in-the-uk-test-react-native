import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {IAnswerResponse, IQuizQuestion} from "../constants/types";
import {useTheme} from "../hooks";

const {width} = Dimensions.get('window');

const QuizQuestion = (props: IQuizQuestion) => {
    const {fonts} = useTheme();
    const [isAnswered, setAnswered] = useState(false);
    const [selectedId, setSelectedId] = useState(0);

    const styles = StyleSheet.create({
        box: {
            alignItems: 'center',
            padding: 7,
            borderRadius: 10,
            margin: 8,
            backgroundColor: '#e5e5e5',
            shadowColor: '#363535',
            shadowOffset: {width: 0, height: 5},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 5,
        }, orderBox: {
            height: 45,
            width: 45,
            justifyContent: 'center',
            borderRadius: 30,
            backgroundColor: '#d9d9d9',
            shadowColor: '#898989',
            shadowOffset: {width: 0, height: 3},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 1,
            marginTop: -25
        },
        questionBox: {
            width: width / 1.2,
            padding: 20,
            borderRadius: 5,
            margin: 8,
            marginBottom: 70,
            backgroundColor: '#c1c0c0',
            shadowColor: '#363535',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 5,
        }, explanationBox: {
            width: width / 1.2,
            padding: 10,
        },
        answerBox: {
            width: width / 1.2,
            padding: 10,
            borderRadius: 5,
            margin: 8,
            shadowColor: '#363535',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 5,
        }, questionText: {
            fontFamily: fonts.p,
            color: '#363535',
            fontSize: 17
        }, orderText: {
            fontFamily: fonts.h1,
            textAlign: "center",
            color: '#474646',
            fontSize: 20
        }, answerText: {
            fontFamily: fonts.p,
            fontSize: 15
        }
    });

    const handleSelect = (answer: IAnswerResponse) => {
        setAnswered(true);
        setSelectedId(answer.id);
        props.onSelect(answer.id);
    }

    useEffect(() => {
        setAnswered(props.isAnswered);
        if (props.selectedId != null && props.selectedId !== 0) {
            setSelectedId(props.selectedId);
        }
    }, [props.id]);

    function getBackgroundColor(id: number) {
        let selectedAnswer = id === selectedId;
        if (isAnswered && selectedAnswer) {
            if (id === props.correctAnswerId) {
                return '#45975c';
            } else {
                return '#bf5c63';
            }
        } else if (isAnswered) {
            if (id === props.correctAnswerId) {
                return '#45975c';
            }
        }
        return '#e0dbda';
    }

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
            <View style={styles.box}>
                <View style={styles.orderBox}>
                    <Text style={styles.orderText}>{props.questionOrder + 1}</Text>
                </View>
                <View style={styles.questionBox}>
                    <Text style={styles.questionText}>{props.content}</Text>
                </View>
                {answers(props.answersList)}
                {(props.isReviewPage && props.explanation?.trim()?.length > 0) ?
                    <View style={styles.explanationBox}>
                        <Text style={styles.questionText}>
                            <Text style={{fontFamily: fonts.medium}}>{'Explanation:'}</Text> {props.explanation}</Text>
                    </View>
                    : ''
                }
            </View>

        </>
    );
}

export default QuizQuestion;
