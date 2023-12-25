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
            questionBox: {
                width: width / 1.2,
                padding: 20,
                borderRadius: 5,
                margin: 8,
                marginBottom: 70,
                backgroundColor: '#a7a5a5',
                shadowColor: '#363535',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 5,
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
            }
            , questionText: {
                fontFamily:fonts.p,
                textAlign: "center",
                fontSize:16
            }, answerText: {
                fontFamily:fonts.p,
                fontSize:15
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
            return '#b2f6f6';
        }

        const answers = (answerList: IAnswerResponse[]) => {
            return answerList?.map((answer) => (
                <TouchableOpacity
                    disabled={isAnswered}
                    key={answer.id}
                    onPress={() => handleSelect(answer)}
                >
                    <View style={{...styles.answerBox, backgroundColor: getBackgroundColor(answer.id)}}>
                        <Text style={styles.answerText}>{answer.content}</Text>
                    </View>
                </TouchableOpacity>
            ));
        };

        return (
            <>
                <View>
                    <View style={styles.questionBox}>
                        <Text style={styles.questionText}>{props.content}</Text>
                    </View>
                    {answers(props.answersList)}
                </View>

            </>
        );
    }
;

export default QuizQuestion;
