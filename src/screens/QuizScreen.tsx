import React, {useEffect, useState} from 'react';
import {Animated, Dimensions, Text, View} from 'react-native';
import apiCaller from "../config/apiCaller";
import {useRoute} from "@react-navigation/native";
import QuizQuestion from "../components/QuizQuestion";
import {BottomMenu} from "../components";
import * as Progress from 'react-native-progress';
import {useTheme} from "../hooks";
import {useSwipe} from "../hooks/useSwipe";

const {height, width} = Dimensions.get('window');

const QuizScreen = ({navigation}) => {
    const {onTouchStart, onTouchEnd} = useSwipe(onSwipeLeft, onSwipeRight, 4)
    const route = useRoute();
    const {quizId, quizGroupId} = route.params;

    const [questionCounter, setQuestionCounter] = useState(0);
    const [correctAnswerCounter, setCorrectAnswerCounter] = useState(0);
    const [quizName, setQuizName] = useState('');
    const [attributes, setAttributes] = useState({});
    const [questionList, setQuestionList] = useState([{}]);
    const [userQuiz, setUserQuiz] = useState({});
    const [activeQuestion, setActiveQuestion] = useState<any>({});
    const {fonts} = useTheme();
    const [answerMap, setAnswerMap] = useState(new Map());
    const shakeAnimation = new Animated.Value(0);

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
                if (quiz?.userQuiz == null) {
                    createUserQuizData();
                } else {
                    quiz?.userQuiz?.correctQuestionList?.forEach(questionId => updateAnswerMap(questionId, quiz?.questionList.find(q => q.id == questionId).correctAnswerId));
                    setCorrectAnswerCounter(quiz?.userQuiz?.correctQuestionList?.length);
                    quiz?.userQuiz?.wrongQuestionList?.forEach(wrongQuestion => updateAnswerMap(wrongQuestion.question.id, wrongQuestion.wrongAnswer.id));
                }
                setAttributes(quiz?.attributes);
                setQuizName(quiz?.name);
                setQuestionList(quiz?.questionList);
                setUserQuiz(quiz.userQuiz);
                setActiveQuestion(quiz.questionList[questionCounter]);
            });
    }, []);

    function onSwipeLeft() {
        let newQuestionOrder = questionCounter + 1;
        if (newQuestionOrder < questionList.length && answerMap.has(activeQuestion?.id)) {
            setQuestionCounter(newQuestionOrder);
            setActiveQuestion(questionList[newQuestionOrder])
        } else if (answerMap.size == newQuestionOrder) {
            navigation.navigate('CompletedQuizScreen', {
                quizName: quizName,
                quizSize: questionList.length,
                correctAnswerSize: correctAnswerCounter
            });
        } else {
            startShake();
        }
    }

    function onSwipeRight() {
        let newQuestionOrder = questionCounter - 1;
        if (newQuestionOrder >= 0) {
            setQuestionCounter(newQuestionOrder);
            setActiveQuestion(questionList[newQuestionOrder])
        }
    }

    function createUserQuizData() {
        let data: any = {quizId: quizId, quizGroupId: quizGroupId};
        apiCaller('user-quiz/create-update-user-quiz', 'POST', data).then(r => console.log(r))
    }

    function updateUserQuizData(id) {
        let data: any = {quizId: quizId, quizGroupId: quizGroupId};
        if (id === activeQuestion.correctAnswerId) {
            setCorrectAnswerCounter(correctAnswerCounter + 1);
            data = {...data, correctQuestionId: activeQuestion.id};
        } else {
            data = {
                ...data,
                userWrongAnswerRequest: {questionId: activeQuestion.id, answerId: id}
            }
        }
        apiCaller('user-quiz/create-update-user-quiz', 'POST', data).then(r => console.log(r))
    }

    function handleAnswer(id) {
        updateAnswerMap(activeQuestion.id, id);
        updateUserQuizData(id);
    }

    const updateAnswerMap = (key, value) => {
        setAnswerMap(map => new Map(map.set(key, value)));
    }

    const startShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, {toValue: 10, duration: 100, useNativeDriver: true}),
            Animated.timing(shakeAnimation, {toValue: -10, duration: 100, useNativeDriver: true}),
            Animated.timing(shakeAnimation, {toValue: 10, duration: 100, useNativeDriver: true}),
            Animated.timing(shakeAnimation, {toValue: 0, duration: 100, useNativeDriver: true})
        ]).start();
    }

    return (
        <>
            <View onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={styles.container}>
                <View style={{paddingTop: height / 14}}>
                    <Text style={styles.questionName}>{quizName}</Text>
                </View>
                <View style={{paddingTop: height / 30}}>
                    <Progress.Bar height={12} color={'#4b4848'}
                                  progress={answerMap.size / questionList.length}
                                  width={width / 1.2}/>
                </View>
                <Animated.View style={{transform: [{translateX: shakeAnimation}]}}>
                    <View style={{paddingTop: height / 30}}>
                        <QuizQuestion id={activeQuestion?.id}
                                      content={activeQuestion?.content}
                                      imgUrl={activeQuestion?.imgUrl}
                                      correctAnswerId={activeQuestion?.correctAnswerId}
                                      attributes={activeQuestion?.attributes}
                                      answersList={activeQuestion?.answersList}
                                      selectedId={answerMap.get(activeQuestion?.id)}
                                      onSelect={handleAnswer}
                                      isAnswered={answerMap.get(activeQuestion?.id)}/>
                    </View>
                </Animated.View>
            </View>
            <BottomMenu/>
        </>
    );
};


export default QuizScreen;
