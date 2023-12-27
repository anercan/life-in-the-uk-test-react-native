import React, {useEffect, useState} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {useRoute} from "@react-navigation/native";
import {BottomMenu, ButtonCard} from "../components";
import {useTheme} from "../hooks";

const {height} = Dimensions.get('window');

const CompletedQuizScreen = ({navigation}) => {
    const route = useRoute();
    const {quizName, quizSize, correctAnswerSize, quizCardList, quizGroupId} = route.params;
    const {fonts} = useTheme();
    const [isNextQuizExist, setNextQuizExist] = useState(true);

    useEffect(() => {
        let nextQuiz = getNextQuiz();
        setNextQuizExist(nextQuiz !== undefined);
    }, []);

    const styles = {
        container: {
            flex: 1,
            alignItems: 'center'
        },
        text: {
            color: '#424141',
            fontSize: 30,
            fontFamily: fonts.medium,
            fontWeight: 'bold'
        }, questionName: {
            color: '#404040',
            fontSize: 16,
            fontFamily: fonts.medium,
            fontWeight: 'bold'
        }, score: {
            color: '#406868',
            fontSize: 30,
            fontFamily: fonts.medium,
            fontWeight: 'bold'
        }
    };

    function getNextQuiz() {
        let indexOfCurrentQuiz = quizCardList?.findIndex(quiz => quiz.name === quizName);
        console.log(indexOfCurrentQuiz,quizCardList)
        return quizCardList[indexOfCurrentQuiz + 1];
    }

    const onPressNextQuiz = () => {
        let nextQuiz = getNextQuiz();
        console.log('nextQuiz',nextQuiz)
        navigation.navigate('QuizScreen', {
            quizId: nextQuiz?.id,
            quizGroupId: quizGroupId,
            quizCardList: quizCardList
        })
    }

    return (
        <>
            <View style={styles.container}>
                <View style={{paddingTop: height / 14}}>
                    <Text style={styles.questionName}>{quizName}</Text>
                </View>
                <View style={{paddingTop: height / 12, paddingBottom: height / 10}}>
                    <Text style={styles.text}>Quiz Completed</Text>
                </View>
                <View style={{paddingBottom: height / 5}}>
                    <Text style={styles.score}> {correctAnswerSize} / {quizSize}</Text>
                </View>
                <ButtonCard buttonText={'Review Wrong Answers'}/>
                {isNextQuizExist && <ButtonCard onPress={onPressNextQuiz} buttonText={'Next Quiz'}/>}
            </View>
            <BottomMenu/>
        </>
    );
};
export default CompletedQuizScreen;
