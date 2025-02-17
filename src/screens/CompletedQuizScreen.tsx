import React, {useContext, useEffect, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import {RouteProp, useRoute} from "@react-navigation/native";
import {ButtonCard} from "../components";
import {useTheme} from "../hooks";
import * as Progress from 'react-native-progress';
import {TitleContext} from "context/TitleContext";
import useApiCaller from "../hooks/useApiCaller";
import {isPremium} from "util/jwtUtil";

const {height} = Dimensions.get('window');

type QuizParams = {
    quizName: string;
    quizSize: number;
    correctAnswerSize: number;
    quizCardList: any[];
    quizGroupId: number;
    quizId: number;
};

type QuizRouteProp = RouteProp<{ CompletedQuizScreen: QuizParams }, 'CompletedQuizScreen'>;

const CompletedQuizScreen = ({navigation}) => {
    const route = useRoute<QuizRouteProp>();
    const {apiCaller} = useApiCaller();
    const {quizName, quizSize, correctAnswerSize, quizCardList, quizGroupId, quizId} = route.params;
    const {fonts,colors,sizes} = useTheme();
    const [isNextQuizExist, setNextQuizExist] = useState(true);
    const { setTitle } = useContext(TitleContext);
    const [completedStatics, setCompletedStatics] = useState({betterCount:0,equalCount:0,worseCount:0});

    const getStaticalData = async ()  => {
        let isPremiumUser = await isPremium();
        if (isPremiumUser) {
            apiCaller('user-quiz/get-completed-quiz-statics?quizId=' + quizId).then((response: any) => {
                setCompletedStatics(response);
            });
        }
    }

    useEffect(() => {
        setTitle(quizName)
        let nextQuiz = getNextQuiz();
        setNextQuizExist(nextQuiz !== undefined);
        getStaticalData();
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            paddingBottom:sizes.sm
        },
        text: {
            color: '#424141',
            fontSize: sizes.l,
            fontFamily: fonts.p,
        },
        scoreText: {
            color: '#424141',
            fontSize: sizes.xl,
            fontFamily: fonts.thin
        },
        staticsText: {
            color: '#424141',
            fontSize: sizes.text,
            fontFamily: fonts.thin,
        },
        scoreBox: {
            justifyContent: 'center',
            height: sizes.base * 20,
            width: sizes.base * 20,
            alignItems: 'center',
            marginBottom: sizes.xl,
            padding: 1,
            borderRadius: sizes.xxxl,
            margin: sizes.xs,
            backgroundColor: colors.primary,
            shadowColor: '#363535',
            shadowOffset: {width: 0, height: 5},
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 5
        }
    });

    const getNextQuiz = () => {
        try {
            let indexOfCurrentQuiz = quizCardList?.findIndex(quiz => quiz.name === quizName);
            return quizCardList[indexOfCurrentQuiz + 1].locked ? undefined : quizCardList[indexOfCurrentQuiz + 1];
        } catch (e) {
            return undefined;
        }
    }

    const onPressNextQuiz = () => {
        let nextQuiz = getNextQuiz();
        navigation.navigate('QuizScreen', {
            quizId: nextQuiz?.id,
            quizGroupId: quizGroupId,
            quizCardList: quizCardList,
            isReviewPage: false
        })
    }

    const onPressReview = () => {
        navigation.navigate('QuizScreen', {
            quizId: quizId,
            quizGroupId: quizGroupId,
            quizCardList: quizCardList,
            isReviewPage: true
        });
    }

    function getScoreText() {
        return Math.round(correctAnswerSize * 100 / quizSize)+'%';
    }

    let totalCompletedUserQuizzes = completedStatics?.equalCount + completedStatics?.worseCount + completedStatics?.betterCount;

    function getPercentage() {
        const total = completedStatics?.equalCount + completedStatics?.worseCount + completedStatics?.betterCount;
        if (total === 0 || !total) return '...';

        const betterOrEqual = completedStatics?.betterCount + completedStatics?.equalCount;
        let number = ((betterOrEqual / total) * 100)?.toFixed(2);
        return number + '%';
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={{paddingTop: sizes.xl, paddingBottom: sizes.xxl}}>
                    <Text style={styles.text}>Completed!</Text>
                </View>

                <View style={styles.scoreBox}>
                    <Progress.Circle
                        animated={true}
                        borderWidth={0}
                        textStyle={{fontFamily: fonts.p, fontSize: sizes.h1}}
                        thickness={15}
                        color={'#ffffff'}
                        showsText={true}
                        formatText={() => getScoreText()}
                        size={sizes.base * 20}
                        progress={correctAnswerSize / quizSize}/>
                </View>
                <View style={{paddingBottom: sizes.xl}}>
                    <Text style={styles.scoreText}>{correctAnswerSize}
                        <Text style={{...styles.scoreText,fontSize:sizes.md}}>/{quizSize}</Text>
                    </Text>
                </View>
                {totalCompletedUserQuizzes > 1 &&
                    <View style={{paddingHorizontal:25,paddingBottom: height / 25}}>
                        <Text style={styles.staticsText}>
                            Your score is better than {getPercentage()} of people.
                        </Text>
                </View>
                }
                {correctAnswerSize !== quizSize &&
                    <ButtonCard onPress={onPressReview} buttonText={'Review'}/>
                }
                {isNextQuizExist &&
                    <ButtonCard onPress={onPressNextQuiz} buttonText={'Next Quiz'}/>
                }

            </View>
        </ScrollView>
    );
};
export default CompletedQuizScreen;
