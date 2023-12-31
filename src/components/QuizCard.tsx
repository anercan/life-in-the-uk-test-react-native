import React from 'react';
import {Dimensions, TouchableOpacity, View, StyleSheet, Text} from 'react-native';

import {IQuizCard, IQuizGroupCard} from '../constants/types';
import {useTheme} from "../hooks";

const {height, width} = Dimensions.get('window');
const QuizCard = ({name, questionCount, solvedCount, attributes}: IQuizCard) => {
    const {fonts,colors} = useTheme();

    const styles = StyleSheet.create({
        card: {
            height: height / 7.5,
            width: width / 1.2,
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
            color: '#404040',
            fontSize: 16,
            fontFamily: fonts.h4,
            fontWeight: 'bold',
            marginBottom: 25,
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
            color: '#4c4c4c',
            fontSize: 14
        },
        count: {
            color: '#4c4c4c',
            fontSize: 14,
        },
    });

    return (
        <TouchableOpacity>
            <View style={styles.card}>
                <Text style={styles.title}>{name}</Text>
                <View style={styles.infoContainer}>
                    <Text style={styles.count}>{solvedCount} / {questionCount} {'Questions'}</Text>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                        <Text style={styles.difficulty}>{'Difficulty: '}{attributes?.difficulty}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};


export default QuizCard;
