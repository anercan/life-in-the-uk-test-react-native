import React from 'react';
import {Dimensions, View, StyleSheet, Text} from 'react-native';

import {IQuizGroupCard} from '../constants/types';
import {useTheme} from "../hooks";
const {height, width} = Dimensions.get('window');

const QuizGroupCard = ({image, title,description,imageUrl,quizQuantity,userSolvedCount,attributes}: IQuizGroupCard) => {
    const {fonts,colors} = useTheme();

    const styles = StyleSheet.create({
        card: {
            height: height / 7.5,
            width: width / 1.15,
            backgroundColor: colors.primary,
            padding: 10,
            borderRadius: 5,
            margin: 8,
            shadowColor: '#363535',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 5,
        },
        title: {
            color: '#3b423e',
            fontSize: 16,
            fontFamily: fonts.h1,
            fontWeight: 'bold',
            marginBottom: 5,
        },
        description: {
            fontFamily: fonts.thin,
            fontSize: 13,
            marginBottom: 3,
        },
        infoContainer: {
            marginTop: 25,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        difficulty: {
            fontFamily: fonts.p,
            color: '#242d2a',
            fontSize: 15
        },
        count: {
            fontFamily: fonts.p,
            color: '#4c4c4c',
            fontSize: 13,
        },
    });

    return (
            <View style={styles.card}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
                <View style={styles.infoContainer}>
                    <Text style={styles.count}>{userSolvedCount} / {quizQuantity} {'Quizzes'}</Text>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                        <Text style={styles.difficulty}>{attributes?.subject}</Text>
                    </View>
                </View>
            </View>
    );
};

export default QuizGroupCard;
