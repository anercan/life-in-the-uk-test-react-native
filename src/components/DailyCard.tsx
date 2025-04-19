import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../hooks';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";

const DailyCard = ({navigation}) => {
    const {fonts, sizes, colors} = useTheme();
    const [isSolved, setIsSolved] = useState(false);

    useEffect(() => {
        isDailyChallengeSolved().then((r) => setIsSolved(r));
    }, []);

    const isDailyChallengeSolved = async () => {
        return await AsyncStorage.getItem('dailyQuiz') === new Date().toISOString().split('T')[0];
    }

    const handlePress = () => {
        navigation.navigate('QuizScreen', {
            quizType: 'DAILY',
            quizCardList: [],
        });
    };

    const styles = StyleSheet.create({
        container: {
            width: '85%',
            height: sizes.xxl,
            marginBottom: sizes.md,
            alignSelf: 'center',
        },
        card: {
            backgroundColor: colors.card,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: sizes.sm,
            paddingVertical: sizes.s,
            borderRadius: sizes.sm,
            borderLeftWidth: sizes.s,
            borderColor: colors.secondary,
            shadowColor: colors.shadow,
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.15,
            shadowRadius: sizes.m,
            elevation: 4,
        },
        textContainer: {
            flex: 1,
        },
        header: {
            fontFamily: fonts.medium,
            fontSize: sizes.text,
            color: colors.secondary,
            marginBottom: sizes.xs,
        },
        subText: {
            fontFamily: fonts.text,
            fontSize: sizes.smallText,
            color: colors.text
        },
        icon: {
            marginLeft: sizes.xxl,
        },
    });

    return (
        <TouchableOpacity
            id="daily-card"
            style={styles.container}
            onPress={handlePress}
            activeOpacity={0.85}
        >
            <View style={styles.card}>
                <View style={styles.textContainer}>
                    <Text style={styles.header}>Daily Challenge</Text>
                    <Text
                        style={styles.subText}>{isSolved ? 'Review Your Daily Quiz Report' : 'Your Daily Quiz is Ready!'}</Text>
                </View>
                <Icon
                    name="chevron-forward"
                    size={sizes.h2}
                    color={colors.secondary}
                    style={styles.icon}
                />
            </View>
        </TouchableOpacity>
    );
};

export default DailyCard;
