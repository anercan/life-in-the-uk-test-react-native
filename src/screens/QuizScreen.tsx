import React, {useContext, useEffect, useState} from 'react';
import {Animated, View} from 'react-native';
import {RouteProp, useRoute} from "@react-navigation/native";
import QuizQuestion from "../components/QuizQuestion";
import {useSwipe} from "hooks/useSwipe";
import {TitleContext} from "context/TitleContext";
import useApiCaller from "../hooks/useApiCaller";
import analytics from "@react-native-firebase/analytics";
import {QuizSettingsContext} from "context/QuizSettingsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getQuestionCount, isDailyQuiz, isRegularQuiz, isReviewMode} from "util/quizUtils";
import ProgressBar from "components/ProgressBar";

type QuizParams = {
    quizType: 'REGULAR' | 'DAILY' | 'REVIEW';
    quizCardList: any[];
    quizGroupId: number;
    quizId: number;
};

type QuizScreenRootProps = RouteProp<{ QuizScreen: QuizParams }, 'QuizScreen'>;

const QuizScreen = ({navigation}) => {
    const {apiCaller} = useApiCaller(navigation);
    const {setTitle} = useContext(TitleContext);
    const {onTouchStart, onTouchEnd} = useSwipe(onSwipeLeft, onSwipeRight, 14);
    const shakeAnimation = new Animated.Value(0);
    const route = useRoute<QuizScreenRootProps>();
    const {quizId, quizGroupId, quizCardList, quizType} = route.params;
    const {
        showCorrectAnswer,
        showExplanationWhileSolving,
        filterCorrectAnswersInReview,
        skipQuestionImmediately
    } = useContext(QuizSettingsContext);
    const [quiz, setQuiz] = useState<any>();
    const [questionList, setQuestionList] = useState([{}]);
    const [activeQuestion, setActiveQuestion] = useState<any>({});
    const [correctAnswerCounter, setCorrectAnswerCounter] = useState(0);
    const [answerMap, setAnswerMap] = useState(new Map());

    useEffect(() => {
        if (isRegularQuiz(quizType) || isReviewMode(quizType)) {
            initRegularQuizData();
        }
        if (isDailyQuiz(quizType)) {
            initUserDailyQuizData();
        }
    }, [quizId, quizType]);

    const initRegularQuizData = () => {
        apiCaller('quiz/get-quiz-with-id/' + quizId)
            .then((quizResponse) => {
                setQuiz(quizResponse);
                setTitle(quizResponse?.name);
                setStatesForQuiz(quizResponse);
                if (isReviewMode(quizType)) {
                    let questions = filterCorrectAnswersInReview ? getWrongQuestions(quizResponse) : quizResponse?.questionList;
                    setQuestionList(questions);
                    setActiveQuestionState(questions, 0);
                } else {
                    setQuestionList(quizResponse?.questionList);
                    setActiveQuestionState(quizResponse?.questionList, getQuestionCount(quizResponse?.userQuiz));
                }
            });
    }

    const initUserDailyQuizData = () => {
        apiCaller('quiz/get-user-daily-quiz', 'POST')
            .then((quizResponse) => {
                AsyncStorage.setItem('dailyQuiz', new Date().toISOString().split('T')[0]);
                if (quizResponse?.userDailyQuizResponse) {
                    navigation.replace('CompletedQuizScreen', {
                        quizSize: quizResponse?.userDailyQuizResponse?.correctQuestionIdList?.length + quizResponse?.userDailyQuizResponse?.wrongQuestionIdList?.length,
                        correctAnswerSize: quizResponse?.userDailyQuizResponse?.correctQuestionIdList?.length,
                        quizCardList: [],
                        isDailyQuiz: true,
                        dailyQuizResponse: quizResponse?.userDailyQuizResponse
                    });
                } else {
                    setTitle('Daily Quiz');
                    let dailyQuestionList = quizResponse?.questionList;
                    setQuestionList(dailyQuestionList);
                    setActiveQuestionState(dailyQuestionList, 0);
                }
            });
    }

    const setStatesForQuiz = (quizResponse) => {
        if (quizResponse?.userQuiz) {
            setStatesForOngoingQuiz(quizResponse);
        } else {
            createUserQuizData();
        }
    }

    const setActiveQuestionState = (questionList, questionCounter) => {
        try {
            let activeQuestion = questionList[questionCounter];
            activeQuestion.counter = questionCounter;
            setActiveQuestion(activeQuestion);
        } catch (e) {
            let activeQuestion = questionList[0];
            activeQuestion.counter = 0;
            setActiveQuestion(activeQuestion);
        }
    }

    const setStatesForOngoingQuiz = (quizResponse) => {
        let answersMap = new Map();
        setCorrectAnswerCounter(quizResponse?.userQuiz?.correctQuestionList?.length);
        quizResponse?.userQuiz?.correctQuestionList?.forEach((questionId) => {
                let question = quizResponse?.questionList.find((q) => q.id == questionId);
                if (question) {
                    answersMap.set(questionId, question?.correctAnswerId);
                }
            }
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
        if (isReviewMode(quizType)) {
            return {
                quizName: quiz?.name,
                quizSize: quiz?.userQuiz?.correctQuestionList.length + quiz?.userQuiz?.wrongQuestionList?.length,
                correctAnswerSize: quiz?.userQuiz?.correctQuestionList.length,
                quizCardList: quizCardList,
                quizGroupId: quizGroupId,
                quizId: quizId
            };
        } else {
            return {
                quizName: quiz?.name,
                quizSize: questionList.length,
                correctAnswerSize: correctAnswerCounter,
                quizCardList: quizCardList,
                quizGroupId: quizGroupId,
                quizId: quizId,
                isDailyQuiz: isDailyQuiz(quizType)
            };
        }
    }

    const updateDailyQuizData = (answerId) => {
        let correctId, wrongId;
        if (answerId === activeQuestion.correctAnswerId) {
            correctId = activeQuestion.id;
        } else {
            wrongId = activeQuestion.id;
        }
        apiCaller('quiz/save-user-daily-quiz', 'POST', {
            correctQuestionId: correctId,
            wrongQuestionId: wrongId,
        })
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

    function onSwipeRight() { // to previous question
        let newQuestionOrder = activeQuestion.counter - 1;
        if (newQuestionOrder >= 0) {
            setActiveQuestionState(questionList, newQuestionOrder);
        }
    }

    const createUserQuizData = () => {
        if (answerMap.size === 0) {
            let data: any = {quizId: quizId, quizGroupId: quizGroupId};
            apiCaller('user-quiz/create-update-user-quiz', 'POST', data);
        }
    }

    const updateUserQuizData = (answerId, correctAnswerId, questionId) => {
        let data: any = {quizId: quizId, quizGroupId: quizGroupId};
        if (answerId === correctAnswerId) {
            data = {...data, correctQuestionId: questionId};
        } else {
            data = {
                ...data,
                userWrongAnswerRequest: {questionId: questionId, answerId: answerId}
            }
        }
        apiCaller('user-quiz/create-update-user-quiz', 'POST', data);
    }

    const logEvent = (eventName) => {
        try {
            analytics().logEvent(eventName, {
                quizName: quiz.name,
                quizId: quizId
            });
        } catch (e) {
        }
    }

    const handleAnswer = (id) => {
        if (isDailyQuiz(quizType)) {
            updateDailyQuizData(id);
        } else {
            updateUserQuizData(id, activeQuestion.correctAnswerId, activeQuestion.id);
        }

        if (id === activeQuestion.correctAnswerId) {
            setCorrectAnswerCounter(correctAnswerCounter + 1);
        }

        updateAnswerMap(activeQuestion.id, id);
        logEvent(isDailyQuiz(quizType) ? 'solve_daily_question' : 'solve_answer');
        if (skipQuestionImmediately) {
            setTimeout(() => onSwipeLeft(), 500);
        }
    }

    const updateAnswerMap = (key, value) => {
        const updatedMap = new Map(answerMap);
        updatedMap.set(key, value);
        setAnswerMap(updatedMap);
    }

    const startShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, {toValue: 15, duration: 100, useNativeDriver: true}),
            Animated.timing(shakeAnimation, {toValue: -15, duration: 100, useNativeDriver: true}),
            Animated.timing(shakeAnimation, {toValue: 15, duration: 100, useNativeDriver: true}),
            Animated.timing(shakeAnimation, {toValue: 0, duration: 100, useNativeDriver: true})
        ]).start();
    }

    const getExplanation = () => {
        if (isReviewMode(quizType)) {
            return activeQuestion?.explanation;
        }
        if (!isReviewMode(quizType) && showExplanationWhileSolving) {
            return activeQuestion?.explanation;
        }
        return '';
    }

    return (
        <>
            <View onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{flex: 1, alignItems: 'center'}}>
                <ProgressBar progress={activeQuestion?.counter / questionList?.length || 0}/>
                <Animated.View style={{transform: [{translateX: shakeAnimation} as any]}}>
                    <QuizQuestion id={activeQuestion?.id}
                                  questionOrder={activeQuestion.counter}
                                  content={activeQuestion?.content}
                                  imgUrl={activeQuestion?.imgUrl}
                                  correctAnswerId={activeQuestion?.correctAnswerId}
                                  answersList={activeQuestion?.answersList}
                                  selectedId={answerMap.get(activeQuestion?.id)}
                                  onSelect={handleAnswer}
                                  isAnswered={answerMap.get(activeQuestion?.id) !== undefined}
                                  isReviewPage={isReviewMode(quizType)}
                                  explanation={getExplanation()}
                                  showCorrectAnswer={isReviewMode(quizType) ? false : showCorrectAnswer}
                    />
                </Animated.View>
            </View>
        </>
    );
};

export default QuizScreen;
