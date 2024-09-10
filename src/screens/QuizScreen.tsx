import React, {useEffect, useState} from 'react';
import {Animated, Dimensions, StyleSheet, Text, View} from 'react-native';
import apiCaller from "../config/apiCaller";
import {useRoute} from "@react-navigation/native";
import QuizQuestion from "../components/QuizQuestion";
import * as Progress from 'react-native-progress';
import {useTheme} from "../hooks";
import {useSwipe} from "../hooks/useSwipe";

const {height, width} = Dimensions.get('window');

const QuizScreen = ({navigation}) => {
    const {onTouchStart, onTouchEnd} = useSwipe(onSwipeLeft, onSwipeRight, 4);
    const shakeAnimation = new Animated.Value(0);
    const route = useRoute();
    const {fonts} = useTheme();
    const {quizId, quizGroupId, quizCardList, isReviewPage} = route.params;

    const [quiz, setQuiz] = useState<any>();
    const [questionList, setQuestionList] = useState([{}]);
    const [activeQuestion, setActiveQuestion] = useState<any>({});
    const [correctAnswerCounter, setCorrectAnswerCounter] = useState(0);
    const [answerMap, setAnswerMap] = useState(new Map());

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center'
        },
        questionName: {
            color: '#404040',
            fontSize: 20,
            fontFamily: fonts.p,
            fontWeight: 'bold'
        }, buttonTextStyle: {
            color: '#393939'
        }, progressBar: {
            paddingTop: height / 30,
        }, customProgressBar: {
            borderRadius: 7
        }
    });

    useEffect(() => {
        apiCaller('quiz/get-quiz-with-id/' + quizId)
            .then((quizResponse) => {
                setQuiz(quizResponse);
                setStatesForQuiz(quizResponse);
                if (isReviewPage) { // only wrong ones will display at review page
                    let wrongQuestions = getWrongQuestions(quizResponse);
                    setQuestionList(wrongQuestions);
                    setActiveQuestionState(wrongQuestions, 0);
                } else {
                    setQuestionList(quizResponse?.questionList);
                    setActiveQuestionState(quizResponse?.questionList, getQuestionCount(quizResponse?.userQuiz));
                }
            });
    }, [quizId, isReviewPage]);

    const getQuestionCount = (userQuiz) => {
        if (userQuiz) {
            if (userQuiz?.state === 'COMPLETED') {
                return 0;
            }
            let corrects = userQuiz?.correctQuestionList ? userQuiz?.correctQuestionList?.length : 0;
            let wrongs = userQuiz?.wrongQuestionList ? userQuiz?.wrongQuestionList?.length : 0;
            return corrects + wrongs - 1;
        }
        return 0;
    }

    const setStatesForQuiz = (quizResponse) => {
        if (quizResponse?.userQuiz) {
            setStatesForOngoingQuiz(quizResponse);
        } else {
            createUserQuizData();
        }
    }

    const setActiveQuestionState = (questionList, questionCounter) => {
        let activeQuestion = questionList[questionCounter];
        activeQuestion.counter = questionCounter;
        setActiveQuestion(activeQuestion);
    }

    const setStatesForOngoingQuiz = (quizResponse) => {
        let answersMap = new Map();
        setCorrectAnswerCounter(quizResponse?.userQuiz?.correctQuestionList?.length);
        quizResponse?.userQuiz?.correctQuestionList?.forEach((questionId) =>
            answersMap.set(questionId, quizResponse?.questionList.find((q) => q.id == questionId)?.correctAnswerId)
        );
        quizResponse?.userQuiz?.wrongQuestionList?.forEach((wrongQuestion) =>
            answersMap.set(wrongQuestion.question.id, wrongQuestion.wrongAnswer.id)
        );
        setAnswerMap(answersMap);
    }

    const getWrongQuestions = (quiz) => {
        let wrongQuestionIdList = quiz?.userQuiz?.wrongQuestionList.map(wrongQuestion => wrongQuestion.question.id);
        return quiz?.questionList.filter(question => wrongQuestionIdList.includes(question.id));
    }

    const getCompletedScreenBody = () => {
        if (isReviewPage) {
            return {
                quizName: quiz.name,
                quizSize: quiz?.userQuiz?.correctQuestionList.length + quiz?.userQuiz?.wrongQuestionList?.length,
                correctAnswerSize: quiz?.userQuiz?.correctQuestionList.length,
                quizCardList: [],
                quizGroupId: quizGroupId,
                quizId: quizId
            };
        } else {
            return {
                quizName: quiz.name,
                quizSize: questionList.length,
                correctAnswerSize: correctAnswerCounter,
                quizCardList: quizCardList,
                quizGroupId: quizGroupId,
                quizId: quizId
            };
        }
    }

    function onSwipeLeft() { // to next question
        let activeOneAnswered = answerMap.has(activeQuestion?.id);
        if (!activeOneAnswered) {
            startShake();
            return;
        }

        let newQuestionOrder = activeQuestion.counter + 1;
        let isLastQuestion = newQuestionOrder == questionList.length;
        if (!isLastQuestion) {
            setActiveQuestionState(questionList, newQuestionOrder)
        } else {
            navigation.navigate('CompletedQuizScreen', getCompletedScreenBody());
        }
    }

    function onSwipeRight() {
        let newQuestionOrder = activeQuestion.counter - 1;
        if (newQuestionOrder >= 0) {
            setActiveQuestionState(questionList, newQuestionOrder);
        }
    }

    function createUserQuizData() {
        if (answerMap.size === 0) {
            let data: any = {quizId: quizId, quizGroupId: quizGroupId};
            apiCaller('user-quiz/create-update-user-quiz', 'POST', data);
        }
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
        apiCaller('user-quiz/create-update-user-quiz', 'POST', data);
    }

    function handleAnswer(id) {
        updateAnswerMap(activeQuestion.id, id);
        updateUserQuizData(id);
    }

    const updateAnswerMap = (key, value) => {
        setAnswerMap(answerMap.set(key, value));
    }

    const startShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, {toValue: 15, duration: 100, useNativeDriver: true}),
            Animated.timing(shakeAnimation, {toValue: -15, duration: 100, useNativeDriver: true}),
            Animated.timing(shakeAnimation, {toValue: 15, duration: 100, useNativeDriver: true}),
            Animated.timing(shakeAnimation, {toValue: 0, duration: 100, useNativeDriver: true})
        ]).start();
    }

    return (
        <>
            <View onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={styles.container}>
                <View style={{paddingTop: 20}}>
                    <Text style={styles.questionName}>{quiz?.name}</Text>
                </View>
                <View style={styles.progressBar}>
                    <Progress.Bar height={15} color={'#012169'} style={styles.customProgressBar}
                                  progress={activeQuestion?.counter / questionList?.length || 0}
                                  width={width / 1.12}/>
                </View>
                <Animated.View style={{transform: [{translateX: shakeAnimation} as any]}}>
                    <View style={{paddingTop: height / 30}}>
                        <QuizQuestion id={activeQuestion?.id}
                                      questionOrder={activeQuestion.counter}
                                      content={activeQuestion?.content}
                                      imgUrl={activeQuestion?.imgUrl}
                                      correctAnswerId={activeQuestion?.correctAnswerId}
                                      attributes={activeQuestion?.attributes}
                                      answersList={activeQuestion?.answersList}
                                      selectedId={answerMap.get(activeQuestion?.id)}
                                      onSelect={handleAnswer}
                                      isAnswered={answerMap.get(activeQuestion?.id) !== undefined}
                                      isReviewPage={isReviewPage}
                                      explanation={activeQuestion?.explanation}
                        />
                    </View>
                </Animated.View>
            </View>
        </>
    );
};


export default QuizScreen;
