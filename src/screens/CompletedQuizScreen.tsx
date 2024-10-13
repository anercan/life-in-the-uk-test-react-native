import React, {useContext, useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {useRoute} from "@react-navigation/native";
import {ButtonCard} from "../components";
import {useTheme} from "../hooks";
import * as Progress from 'react-native-progress';
import {TitleContext} from "../context/TitleContext";

const {height} = Dimensions.get('window');

const CompletedQuizScreen = ({navigation}) => {
    const route = useRoute();
    const {quizName, quizSize, correctAnswerSize, quizCardList, quizGroupId, quizId} = route.params;
    const {fonts} = useTheme();
    const [isNextQuizExist, setNextQuizExist] = useState(true);
    const { setTitle } = useContext(TitleContext);

    useEffect(() => {
        setTitle(quizName)
        let nextQuiz = getNextQuiz();
        setNextQuizExist(nextQuiz !== undefined);
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center'
        },
        text: {
            color: '#424141',
            fontSize: 40,
            fontFamily: fonts.medium,
            fontWeight: 'bold'
        }, quizName: {
            color: '#404040',
            fontSize: 20,
            fontFamily: fonts.h1,
        }, scoreBox: {
            justifyContent: 'center',
            height: 150,
            width: 150,
            alignItems: 'center',
            marginBottom: height / 6,
            padding: 1,
            borderRadius: 100,
            margin: 8,
            backgroundColor: '#012169',
            shadowColor: '#363535',
            shadowOffset: {width: 0, height: 5},
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 5
        }
    });

    function getNextQuiz() {
        let indexOfCurrentQuiz = quizCardList?.findIndex(quiz => quiz.name === quizName);
        return quizCardList[indexOfCurrentQuiz + 1];
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
        return `${correctAnswerSize} / ${quizSize}`;
    }

    return (
        <>
            <View style={styles.container}>
                <View style={{paddingTop: height / 25, paddingBottom: height / 10}}>
                    <Text style={styles.text}>Completed!</Text>
                </View>

                <View style={styles.scoreBox}>
                    <Progress.Circle
                        animated={true}
                        borderWidth={0}
                        textStyle={{fontFamily: fonts.p, fontSize: 25}}
                        thickness={15}
                        color={'#ffffff'}
                        showsText={true}
                        formatText={() => getScoreText()}
                        size={150}
                        progress={correctAnswerSize / quizSize}/>
                </View>
                {correctAnswerSize !== quizSize &&
                    <ButtonCard onPress={onPressReview} buttonText={'Review Wrong Answers'}/>
                }
                {isNextQuizExist && <ButtonCard onPress={onPressNextQuiz} buttonText={'Next Quiz'}/>}
            </View>
        </>
    );
};
export default CompletedQuizScreen;
