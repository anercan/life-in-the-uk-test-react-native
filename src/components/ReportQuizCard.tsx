import React from 'react';
import {Dimensions, TouchableOpacity, View, StyleSheet, Text} from 'react-native';
import {ISolvedQuizCard} from '../constants/types';
import {useTheme} from "../hooks";

const {height, width} = Dimensions.get('window');
const ReportQuizCard = ({id, quiz, state, timeTaken, completeDate}: ISolvedQuizCard) => {
    const {fonts} = useTheme();

    const styles = StyleSheet.create({
        card: {
            height: height / 7.5,
            width: width / 1.2,
            backgroundColor: '#b2f6f6',
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
                <Text style={styles.title}>{quiz?.name}</Text>
                <View style={styles.infoContainer}>
                    <Text style={styles.count}>{completeDate}</Text>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                        <Text style={styles.difficulty}>{quiz?.attributes?.difficulty}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};
export default ReportQuizCard;
