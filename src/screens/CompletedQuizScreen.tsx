import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import {useRoute} from "@react-navigation/native";
import {BottomMenu, ButtonCard} from "../components";
import * as Progress from 'react-native-progress';
import {useTheme} from "../hooks";

const {height, width} = Dimensions.get('window');

const CompletedQuizScreen = ({navigation}) => {
    const route = useRoute();
    const {quizName, quizSize, correctAnswerSize} = route.params;
    const {fonts} = useTheme();

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

    return (
        <>
            <View style={styles.container}>
                <View style={{paddingTop: height / 14}}>
                    <Text style={styles.questionName}>{quizName}</Text>
                </View>
                <View style={{paddingTop: height / 30}}>
                    <Progress.Bar height={12} color={'#4b4848'} progress={1} width={width / 1.2}/>
                </View>
                <View style={{paddingTop: height / 12, paddingBottom: height / 10}}>
                    <Text style={styles.text}>Quiz Completed</Text>
                </View>
                <View style={{paddingBottom: height / 5}}>
                    <Text style={styles.score}> {correctAnswerSize} / {quizSize}</Text>
                </View>
                <ButtonCard buttonText={'Review Wrong Answers'}/>
                <ButtonCard buttonText={'Next Quiz'}/>
            </View>
            <BottomMenu/>
        </>
    );
};
export default CompletedQuizScreen;
