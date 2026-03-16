import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {RouteProp, useRoute} from "@react-navigation/native";
import {ButtonCard} from "../components";
import {useTheme} from "../hooks";
import {TitleContext} from "context/TitleContext";
import ScoreCard from "components/ScoreCard";
import {isDailyQuiz, isFavoritesQuiz, mapWrongsToPieChartData} from "util/quizUtils";
import DataDistributionCard from "components/DataDistribution";
import InAppReview from 'react-native-in-app-review';
import {logEvent} from "util/logUtil";
import {handleReviewRequest} from "util/commonUtil";
import {AppText} from "components";
import {useQuizService} from "services/QuizService";

type QuizParams = {
    quizName: string;
    quizSize: number;
    correctAnswerSize: number;
    wrongAnswerSize: number;
    quizCardList: any[];
    quizGroupId: number;
    quizId: number;
    quizType: string;
    dailyQuizResponse?: any;
};

type QuizRouteProp = RouteProp<{ CompletedQuizScreen: QuizParams }, 'CompletedQuizScreen'>;

const CompletedQuizScreen = ({navigation}) => {
    const {getCompletedQuizStatistics, getDailyQuiz} = useQuizService(navigation);
    const route = useRoute<QuizRouteProp>();
    const {
        quizName,
        quizSize,
        correctAnswerSize,
        wrongAnswerSize,
        quizCardList,
        quizGroupId,
        quizId,
        quizType,
        dailyQuizResponse
    } = route.params;
    const {colors, fonts, sizes} = useTheme();
    const [isNextQuizExist, setNextQuizExist] = useState(true);
    const {setTitle} = useContext(TitleContext);
    const [completedStatics, setCompletedStatics] = useState({betterCount: 0, equalCount: 0, worseCount: 0});
    const [incorrectList, setIncorrectList] = useState<any[]>([]);

    useEffect(() => {
        setTitle('Completed');
        let nextQuiz = getNextQuiz();
        setNextQuizExist(nextQuiz !== undefined);
        getStaticalData();
        reviewModal();
    }, []);

    const reviewModal = async () => {
        const isAvailable = InAppReview.isAvailable();
        if (isAvailable) { //&& correctAnswerSize > 9
            handleReviewRequest('CompletedScreenReview').then((shouldShowModal) => {
                if (shouldShowModal) {
                    InAppReview.RequestInAppReview()
                        .then(() => {
                            logEvent('review');
                        })
                        .catch((error) => {
                            logEvent('reviewError', {error: error})
                        });
                }
            });
        }
    }

    const getStaticalData = async () => {
        if (quizId) {
            getCompletedQuizStatistics(quizId).then((response: any) => {
                setCompletedStatics(response);
            });
        } else if (isDailyQuiz(quizType)) {
            if (dailyQuizResponse) {
                setIncorrectList(mapWrongsToPieChartData(dailyQuizResponse?.wrongQuestionsSubjects));
            } else {
                getDailyQuiz()
                    .then((quizResponse) => {
                        if (quizResponse?.userDailyQuizResponse?.wrongQuestionsSubjects) {
                            setIncorrectList(mapWrongsToPieChartData(quizResponse?.userDailyQuizResponse?.wrongQuestionsSubjects));
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

    const onPressReview = (reviewType) => {
        navigation.navigate('QuizScreen', {
            quizType: reviewType,
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
        <ScrollView contentContainerStyle={{paddingHorizontal: sizes.sm, paddingBottom: sizes.sm, paddingTop: sizes.m}}>

            <ScoreCard
                onPress={(reviewType) => onPressReview(reviewType)}
                quizName={quizName}
                isTabsActive={!(isDailyQuiz(quizType) || isFavoritesQuiz(quizType))}
                total={quizSize}
                correct={correctAnswerSize}
                wrong={wrongAnswerSize}
            />

            {totalCompletedUserQuizzes > 1 &&
                <>
                    <View style={{marginVertical: sizes.m, alignItems: 'center'}}>
                        <AppText style={{
                            textAlign: 'auto',
                            fontFamily: fonts.p
                        }}>
                            You scored higher than <AppText
                            style={{
                                textAlign: 'auto',
                                fontFamily: fonts.medium
                            }}>{getPercentage()}%</AppText> of
                            people.
                        </AppText>
                    </View>
                </>
            }
            {isDailyQuiz(quizType) && (Object.keys(incorrectList)?.length > 0) &&
                <DataDistributionCard propData={incorrectList} isLoadingProp={false}/>
            }
            {isDailyQuiz(quizType) &&
                <View style={{alignItems: 'center'}}>
                    <AppText style={{color: colors.text, fontSize: sizes.text, fontFamily: fonts.p}}>
                        Don't forget to come back tomorrow!
                    </AppText>
                </View>
            }

            {!isDailyQuiz(quizType) && !isFavoritesQuiz(quizType) && correctAnswerSize !== quizSize &&
                <ButtonCard style={{alignSelf: 'center', marginTop: sizes.l}}
                            onPress={() => onPressReview('REVIEW_ALL')} buttonText={'Review'}/>
            }
            {isNextQuizExist &&
                <ButtonCard style={{alignSelf: 'center'}} onPress={onPressNextQuiz} buttonText={'Next Quiz'}/>
            }

        </ScrollView>
    );
};
export default CompletedQuizScreen;
