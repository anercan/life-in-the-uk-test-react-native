import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {RouteProp, useRoute} from "@react-navigation/native";
import {ButtonCard} from "../components";
import {useTheme} from "../hooks";
import {TitleContext} from "context/TitleContext";
import useApiCaller from "../hooks/useApiCaller";
import ScoreCard from "components/ScoreCard";
import DataDistributionCard from "components/DataDistributionCard";

type QuizParams = {
    quizName: string;
    quizSize: number;
    correctAnswerSize: number;
    quizCardList: any[];
    quizGroupId: number;
    quizId: number;
    isDailyQuiz?: boolean;
    dailyQuizResponse?: any;
};

type QuizRouteProp = RouteProp<{ CompletedQuizScreen: QuizParams }, 'CompletedQuizScreen'>;

const CompletedQuizScreen = ({navigation}) => {
    const route = useRoute<QuizRouteProp>();
    const {apiCaller} = useApiCaller();
    const {
        quizName,
        quizSize,
        correctAnswerSize,
        quizCardList,
        quizGroupId,
        quizId,
        isDailyQuiz,
        dailyQuizResponse
    } = route.params;
    const {colors, fonts, sizes} = useTheme();
    const [isNextQuizExist, setNextQuizExist] = useState(true);
    const {setTitle} = useContext(TitleContext);
    const [completedStatics, setCompletedStatics] = useState({betterCount: 0, equalCount: 0, worseCount: 0});
    const [wrongsMap, setWrongsMap] = useState<any>({});

    useEffect(() => {
        setTitle('Completed');
        let nextQuiz = getNextQuiz();
        setNextQuizExist(nextQuiz !== undefined);
        getStaticalData();
    }, []);

    const getStaticalData = async () => {
        if (quizId) {
            apiCaller('user-quiz/get-completed-quiz-statics?quizId=' + quizId).then((response: any) => {
                setCompletedStatics(response);
            });
        } else if (isDailyQuiz) {
            if (dailyQuizResponse) {
                setWrongsMap(dailyQuizResponse?.wrongQuestionsSubjects);
            } else {
                apiCaller('quiz/get-user-daily-quiz', 'POST')
                    .then((quizResponse) => {
                        if (quizResponse?.userDailyQuizResponse) {
                            setWrongsMap(quizResponse?.userDailyQuizResponse?.wrongQuestionsSubjects)
                        }
                    });
            }
        }
    }

    const getNextQuiz = () => {
        try {
            let indexOfCurrentQuiz = quizCardList?.findIndex(quiz => quiz.name === quizName);
            return quizCardList[indexOfCurrentQuiz + 1];
        } catch (e) {
            return undefined;
        }
    }

    const onPressNextQuiz = () => {
        let nextQuiz = getNextQuiz();
        if (nextQuiz?.locked) {
            navigation.navigate('GetPremiumScreen');
        } else {
            navigation.navigate('QuizScreen', {
                quizType: 'REGULAR',
                quizId: nextQuiz?.id,
                quizGroupId: quizGroupId,
                quizCardList: quizCardList,
            })
        }
    }

    const onPressReview = () => {
        navigation.navigate('QuizScreen', {
            quizType: 'REVIEW',
            quizId: quizId,
            quizGroupId: quizGroupId,
            quizCardList: quizCardList
        });
    }

    let totalCompletedUserQuizzes = completedStatics?.equalCount + completedStatics?.worseCount + completedStatics?.betterCount;

    const getPercentage = (): number => {
        const total = completedStatics?.equalCount + completedStatics?.worseCount + completedStatics?.betterCount;
        if (total === 0 || !total) return 0;

        const betterOrEqual = completedStatics?.betterCount + completedStatics?.equalCount;
        let number = ((betterOrEqual / total) * 100)?.toFixed(2);
        return Number(number);
    }

    return (
        <ScrollView contentContainerStyle={{alignItems: 'center', padding: sizes.sm, paddingTop: sizes.m}}>

            <ScoreCard quizName={isDailyQuiz ? 'Daily Quiz' : quizName} total={quizSize} correct={correctAnswerSize}
                       wrong={quizSize - correctAnswerSize}/>

            {totalCompletedUserQuizzes > 1 &&
                <>
                    <View style={{marginBottom: sizes.xxxl, alignItems: 'center'}}>
                        <Text style={{color: colors.text, fontSize: sizes.text, fontFamily: fonts.p}}>
                            You scored higher than <Text style={{fontFamily: fonts.medium}}>{getPercentage()}%</Text> of
                            people.
                        </Text>
                    </View>
                </>
            }
            {isDailyQuiz && (Object.keys(dailyQuizResponse?.wrongQuestionsSubjects || {}).length > 0) &&
                <DataDistributionCard incorrectMapProps={wrongsMap}/>
            }
            {isDailyQuiz &&
                <View style={{marginBottom: sizes.xxxl, alignItems: 'center'}}>
                    <Text style={{color: colors.text, fontSize: sizes.text, fontFamily: fonts.p}}>
                        Don't forget to come back tomorrow!
                    </Text>
                </View>
            }

            {!isDailyQuiz && correctAnswerSize !== quizSize &&
                <ButtonCard onPress={onPressReview} buttonText={'Review'}/>
            }
            {isNextQuizExist &&
                <ButtonCard onPress={onPressNextQuiz} buttonText={'Next Quiz'}/>
            }

        </ScrollView>
    );
};
export default CompletedQuizScreen;
