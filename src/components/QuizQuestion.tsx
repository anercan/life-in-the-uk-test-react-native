import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {IAnswerResponse, IQuizQuestion} from "../constants/types";
import {useTheme} from "../hooks";
import {useSwipe} from "../hooks/useSwipe";

const {height, width} = Dimensions.get('window');

const QuizQuestion = (props: IQuizQuestion) => {

        const {fonts} = useTheme();
        const [isAnswered, setAnswered] = useState(false);
        const styles = StyleSheet.create({
            questionBox: {
                width: width / 1.2,
                padding: 10,
                borderRadius: 5,
                margin: 8,
                backgroundColor: '#dde3e3',
                shadowColor: '#363535',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 5,
            }, questionText: {
                textAlign: "center"
            }
        });

        const handleSelect = (answer: IAnswerResponse) => {
            setAnswered(true);
        }

        function getBackgroundColor(id: number) { //secim listesini bir üstte tutmak
            if (isAnswered) {
                if (id === props.correctAnswerId) {
                    return '#45975c';
                } else {
                    return '#bf5c63';
                }
            }
            return '#b2f6f6';
        }

        const answers = (answerList: IAnswerResponse[]) => {
            return answerList?.map((answer, index) => (
                <TouchableOpacity
                    key={answer.id}
                    onPress={() => handleSelect(answer)}
                >
                    <View style={{...styles.questionBox, backgroundColor: getBackgroundColor(answer.id)}}>
                        <Text>{answer.content}</Text>
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
