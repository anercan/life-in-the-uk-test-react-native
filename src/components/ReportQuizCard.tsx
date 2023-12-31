import React from 'react';
import {Dimensions, TouchableOpacity, View, StyleSheet, Text} from 'react-native';
import {ISolvedQuizCard} from '../constants/types';
import {useTheme} from "../hooks";

const {height, width} = Dimensions.get('window');
const ReportQuizCard = ({id, quiz, state, timeTaken, completeDate}: ISolvedQuizCard) => {
    const {fonts, colors} = useTheme();

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

    function getDateWithFormat(dateText) {
        try {
            const date = new Date(dateText);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${day}.${month}.${year} ${hours}:${minutes}`;
        } catch (exception) {
            return '';
        }
    }

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{quiz?.name}</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.count}>{getDateWithFormat(completeDate)}</Text>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <Text style={styles.difficulty}>{'Difficulty: '}{quiz?.attributes?.difficulty}</Text>
                </View>
            </View>
        </View>
    );
};
export default ReportQuizCard;
