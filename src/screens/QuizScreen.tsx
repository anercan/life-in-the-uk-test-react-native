import React, {useEffect, useState} from 'react';
import {Dimensions, Text, View} from 'react-native';
import apiCaller from "../config/apiCaller";
import {useRoute} from "@react-navigation/native";
import QuizQuestion from "../components/QuizQuestion";
import {BottomMenu} from "../components";
import * as Progress from 'react-native-progress';
import {useTheme} from "../hooks";
import {useSwipe} from "../hooks/useSwipe";

const {height, width} = Dimensions.get('window');

const QuizScreen = () => {
    const route = useRoute();
    const {quizId} = route.params;
    const [questionCounter, setQuestionCounter] = useState(0);
    const [quizName, setQuizName] = useState('');
    const [attributes, setAttributes] = useState({});
    const [questionList, setQuestionList] = useState([{}]);
    const [userQuiz, setUserQuiz] = useState({});
    const [activeQuestion, setActiveQuestion] = useState<any>({});
    const {fonts} = useTheme();
    const {onTouchStart, onTouchEnd} = useSwipe(onSwipeLeft, onSwipeRight, 6)

    const styles = {
        container: {
            flex: 1,
            alignItems: 'center'
        },
        questionName: {
            color: '#404040',
            fontSize: 16,
            fontFamily: fonts.medium,
            fontWeight: 'bold'
        }
        , buttonTextStyle: {
            color: '#393939'
        }
    };

    useEffect(() => {
        apiCaller('quiz/get-quiz-with-id/' + quizId)
            .then(quiz => {
                setAttributes(quiz?.attributes);
                setQuizName(quiz?.name);
                setQuestionList(quiz?.questionList);
                setUserQuiz(quiz.userQuiz);
                setActiveQuestion(quiz.questionList[0])
            });
    }, []);

    function onSwipeLeft() {
        setQuestionCounter(questionCounter + 1);
        setActiveQuestion(questionList[questionCounter + 1])
    }

    function onSwipeRight() {
        setQuestionCounter(questionCounter - 1);
        setActiveQuestion(questionList[questionCounter - 1])
    }

    return (
        <>
            <View onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={styles.container}>
                <View style={{paddingTop: 60}}>
                    <Text style={styles.questionName}>{quizName}</Text>
                </View>
                <View style={{paddingTop: 25}}>
                    <Progress.Bar height={12} color={'#4b4848'}
                                  progress={questionCounter > 0 ? questionCounter / questionList.length : 0}
                                  width={width / 1.2}/>
                </View>
                <View style={{paddingTop: height / 5}}>
                    <QuizQuestion id={activeQuestion?.id}
                                  content={activeQuestion?.content}
                                  imgUrl={activeQuestion?.imgUrl}
                                  correctAnswerId={activeQuestion?.correctAnswerId}
                                  attributes={activeQuestion?.attributes}
                                  answersList={activeQuestion?.answersList}/>
                </View>
            </View>
            <BottomMenu/>
        </>
    );
};


export default QuizScreen;
