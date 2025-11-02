import React, {useContext, useEffect, useState} from 'react';
import {Animated, ScrollView, View} from 'react-native';
import {RouteProp, useRoute} from "@react-navigation/native";
import QuizQuestion from "../components/QuizQuestion";
import {useSwipe} from "hooks/useSwipe";
import {TitleContext} from "context/TitleContext";
import useApiCaller from "../hooks/useApiCaller";
import {QuizSettingsContext} from "context/QuizSettingsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    getQuestionCount,
    getQuestions,
    isDailyQuiz,
    isFavoritesQuiz,
    isRegularQuiz,
    isReviewMode,
    QuizParams
} from "util/quizUtils";
import ProgressBar from "components/ProgressBar";
import {logEvent} from "util/logUtil";
import {useTheme} from "hooks";
import StatusBox from "components/StatusBox";
import {useSound} from "hooks/useSound";

type QuizScreenRootProps = RouteProp<{ QuizScreen: QuizParams }, 'QuizScreen'>;

const QuizScreen = ({navigation}) => {
    const {apiCaller} = useApiCaller(navigation);
    const {setTitle} = useContext(TitleContext);
    const [answerMap, setAnswerMap] = useState(new Map());
    const [activeQuestion, setActiveQuestion] = useState<any>({});
    const {onTouchStart, onTouchEnd} = useSwipe(onSwipeLeft, onSwipeRight, 20);
    const shakeAnimation = new Animated.Value(0);
    const route = useRoute<QuizScreenRootProps>();
    const {quizId, quizGroupId, quizCardList, quizType} = route.params;
    const {
        showCorrectAnswer,
        showExplanationWhileSolving,
        skipQuestionImmediately,
        playSounds,
        setPlaySound
    } = useContext(QuizSettingsContext);
    const [quiz, setQuiz] = useState<any>();
    const [questionList, setQuestionList] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [answerCounter, setAnswerCounter] = useState({total: 0, correct: 0, wrong: 0});
    const {sizes} = useTheme();
    const {play} = useSound('correct.mp3');

    useEffect(() => {
        setFavorites();
        if (isRegularQuiz(quizType) || isReviewMode(quizType)) {
            initRegularQuizData();
        } else if (isDailyQuiz(quizType)) {
            initUserDailyQuizData();
        } else if (isFavoritesQuiz(quizType)) {
            initFavoritesData();
        }
    }, [quizId, quizType]);

    const initRegularQuizData = () => {
        apiCaller('quiz/get-quiz-with-id/' + quizId)
            .then((quizResponse) => {
                setQuiz(quizResponse);
                setTitle(quizResponse?.name);
                setStatesForQuiz(quizResponse);
                if (isReviewMode(quizType)) {
                    let questions = getQuestions(quizResponse, quizType);
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
                const quizData = {name: 'Daily Quiz'};
                setQuiz(quizData);
                if (quizResponse?.userDailyQuizResponse) {
                    AsyncStorage.setItem('dailyQuiz', new Date().toISOString().split('T')[0]);
                    navigation.replace('CompletedQuizScreen', {
                        quizName: quizData.name,
                        quizSize: quizResponse?.userDailyQuizResponse?.correctQuestionIdList?.length + quizResponse?.userDailyQuizResponse?.wrongQuestionIdList?.length,
                        correctAnswerSize: quizResponse?.userDailyQuizResponse?.correctQuestionIdList?.length,
                        wrongAnswerSize: quizResponse?.userDailyQuizResponse?.wrongQuestionIdList?.length,
                        quizCardList: [],
                        quizType: quizType,
                        dailyQuizResponse: quizResponse?.userDailyQuizResponse
                    });
                } else {
                    AsyncStorage.setItem('dailyQuiz', new Date().toISOString().split('T')[0]);
                    setTitle('Daily Quiz');
                    let dailyQuestionList = quizResponse?.questionList;
                    setQuestionList(dailyQuestionList);
                    setActiveQuestionState(dailyQuestionList, 0);
                    setAnswerCounter({total: dailyQuestionList?.length, correct: 0, wrong: 0});
                }
            });
    }

    const initFavoritesData = () => {
        apiCaller('favorite/get-user-questions')
            .then((quizResponse) => {
                setTitle('Favorites');
                setQuiz(quizResponse);
                setQuestionList(quizResponse?.questionList);
                setActiveQuestionState(quizResponse?.questionList, 0);
                setAnswerCounter({total: quizResponse?.questionList?.length, correct: 0, wrong: 0});
            });
    }

    const setFavorites = () => {
        apiCaller('favorite/get-user-question-ids').then(response => {
            if (response?.favoriteIds) {
                setFavoriteIds(response?.favoriteIds)
            }
        });
    }

    const setStatesForQuiz = (quizResponse) => {
        if (quizResponse?.userQuiz) {
            setStatesForOngoingQuiz(quizResponse);
        } else {
            createUserQuizData(quizResponse);
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
        setAnswerCounter({
            total: quizResponse?.questionList?.length ?? 0,
            wrong: quizResponse?.userQuiz?.wrongQuestionList?.length ?? 0,
            correct: quizResponse?.userQuiz?.correctQuestionList?.length ?? 0
        });
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

    const getCompletedScreenBody = () => {
        return {
            quizName: quiz?.name,
            quizSize: answerCounter.total,
            correctAnswerSize: answerCounter.correct,
            wrongAnswerSize: answerCounter.wrong,
            quizCardList: quizCardList,
            quizGroupId: quizGroupId,
            quizId: quizId,
            quizType: quizType
        };
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

    const skipNextQuestion = () => {
        let newQuestionOrder = activeQuestion.counter + 1;
        let isLastQuestion = newQuestionOrder == questionList.length;
        if (!isLastQuestion) {
            setActiveQuestionState(questionList, newQuestionOrder)
        } else {
            navigation.navigate('CompletedQuizScreen', getCompletedScreenBody());
        }
    }

    function onSwipeLeft() { // to next question
        let activeOneAnswered = answerMap.has(activeQuestion?.id) || isFavoritesQuiz(quizType);
        if (!activeOneAnswered) {
            startShake();
            return;
        }
        skipNextQuestion();
    }

    function onSwipeRight() { // to previous question
        let newQuestionOrder = activeQuestion.counter - 1;
        if (newQuestionOrder >= 0) {
            setActiveQuestionState(questionList, newQuestionOrder);
        }
    }

    const createUserQuizData = (quizResponse) => {
        if (answerMap.size === 0) {
            setAnswerCounter(prev => ({...prev, total: quizResponse?.questionList?.length ?? 0}));
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

    const handleAnswer = (id) => {
        if (isDailyQuiz(quizType)) {
            updateDailyQuizData(id);
        } else if (isRegularQuiz(quizType)) {
            updateUserQuizData(id, activeQuestion.correctAnswerId, activeQuestion.id);
        }

        if (id === activeQuestion.correctAnswerId) {
            play();
            setAnswerCounter(prev => ({...prev, correct: prev.correct + 1}));
        } else {
            setAnswerCounter(prev => ({...prev, wrong: prev.wrong + 1}));
        }

        updateAnswerMap(activeQuestion.id, id);
        logEvent('solve_answer', {quizName: quiz?.name});
        if (skipQuestionImmediately) {
            setTimeout(() => skipNextQuestion(), 500);
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

    const favOperation = (questionId, isAddOperation) => {
        if (isAddOperation) {
            logEvent('favorite', {questionId: questionId});
        }
        apiCaller('favorite/add-or-remove', 'POST', {
            add: isAddOperation,
            questionId: questionId
        }).then((response) => {
            if (response?.favoriteIds) {
                setFavoriteIds(response.favoriteIds);
            }
        })
    }

    if (isFavoritesQuiz(quizType) && questionList?.length === 0) {
        return (
            <StatusBox text={'You don’t have any favorites yet.'}/>
        );
    }

    if (questionList?.length === 0) {
        return <></>;
    }

    return (
        <View onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              style={{flex: 1, flexDirection: 'column'}}
        >
            <View style={{flex: 1}}>
                <ProgressBar favOperation={(questionId, isAddOperation) => favOperation(questionId, isAddOperation)}
                             isCurrentInFav={favoriteIds?.includes(activeQuestion?.id)}
                             questionId={activeQuestion?.id}
                             isMuted={!playSounds}
                             setPlaySound={() => setPlaySound(!playSounds)}
                             progress={activeQuestion?.counter / questionList?.length || 0}/>
            </View>
            <View style={{flex: 14, justifyContent: 'flex-start'}}>
                <ScrollView style={{paddingTop: sizes.md}}
                            contentContainerStyle={{paddingBottom: sizes.xxl}}
                >
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
                                      onSkipTap={() => onSwipeLeft()}
                        />
                    </Animated.View>
                </ScrollView>
            </View>
        </View>
    );
};

export default QuizScreen;
