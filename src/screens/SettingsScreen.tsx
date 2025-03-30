import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Switch, TouchableOpacity, StyleSheet, FlatList, Linking, Platform} from 'react-native';
import {useData, useTheme} from "hooks";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {TitleContext} from "context/TitleContext";
import {AuthContext} from "context/AuthContext";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {isPremium} from "util/jwtUtil";
import {QuizSettingsContext} from "context/QuizSettingsContext";
import * as StoreReview from "react-native-store-review";

const SettingsScreen = ({navigation}) => {
    const {setTitle} = useContext(TitleContext);
    const {fonts, colors, sizes} = useTheme();
    const {isDark, setIsDark} = useData();
    const {logout} = useContext(AuthContext);
    const {
        setExplanationWhileSolving,
        setCorrectAnswer,
        setFilterCorrectsInReview,
        showCorrectAnswer,
        showExplanationWhileSolving,
        filterCorrectAnswersInReview,
        skipQuestionImmediately,
        setSkipQuestion
    } = useContext(QuizSettingsContext);

    const [isPremiumUser, setIsPremiumUser] = useState(false);

    useEffect(() => {
        setTitle('Settings');
        checkPremiumStatus();
    }, []);

    const checkPremiumStatus = async () => {
        const premium = await isPremium();
        setIsPremiumUser(premium);
    };

    const toggleCorrectAnswer = () => {
        let newState = !showCorrectAnswer;
        setCorrectAnswer(newState);
        if (newState == false && showExplanationWhileSolving == true) {
            setExplanationWhileSolving(false);
        }
    }

    const toggleShowExplanationOnlyReview = () => {
        let newState = !showExplanationWhileSolving;
        setExplanationWhileSolving(newState);
        if (newState == true && showCorrectAnswer == false) {
            setCorrectAnswer(true);
        }
    }

    const settingsOptions = [
        {
            id: '1',
            title: 'Get Premium+',
            buttonText: 'View',
            icon: 'account-star-outline',
            type: 'button',
            show: !isPremiumUser,
            onPress: () => navigation.push('GetPremiumScreen')
        },
        {
            id: '2',
            title: 'Dark Mode',
            icon: 'theme-light-dark',
            type: 'switch',
            value: isDark,
            onToggle: () => setIsDark(!isDark)
        },
        {
            id: '3',
            title: 'Skip Question Immediately',
            icon: 'skew-more',
            type: 'switch',
            value: skipQuestionImmediately,
            onToggle: () => setSkipQuestion(!skipQuestionImmediately)
        },
        {
            id: '4',
            title: 'Show Correct Answer After Incorrect',
            icon: 'playlist-check',
            type: 'switch',
            value: showCorrectAnswer,
            onToggle: () => {
                toggleCorrectAnswer();
            }
        },
        {
            id: '5',
            title: 'Show Explanation After Incorrect',
            icon: 'card-text-outline',
            type: 'switch',
            value: showExplanationWhileSolving,
            onToggle: () => toggleShowExplanationOnlyReview()
        },
        {
            id: '6',
            title: 'Hide Correct Answers In Review',
            icon: 'filter-check-outline',
            type: 'switch',
            value: filterCorrectAnswersInReview,
            onToggle: () => setFilterCorrectsInReview(!filterCorrectAnswersInReview)
        },
        {
            id: '7',
            title: 'Leave a Review',
            buttonText: 'Review',
            icon: 'star-check-outline',
            type: 'button',
            onPress: () => StoreReview.requestReview()
        },
        {
            id: '8',
            title: 'Privacy Policy',
            buttonText: 'View',
            icon: 'file-document-outline',
            type: 'button',
            onPress: () => Linking.openURL('https://quizmarkt.com/life-in-the-uk/privacy-policy.html')
        },
        {
            id: '9',
            title: 'Logout',
            buttonText: 'Logout',
            icon: 'logout',
            type: 'button',
            onPress: () => logoutInternal()
        }
    ];

    const logoutInternal = async () => {
        logout();
        await GoogleSignin.signOut();
    }


    const styles = StyleSheet.create({
        container: {flex: 1, backgroundColor: colors.secondaryBackground, paddingTop: sizes.sm, paddingLeft: sizes.m},
        settingItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: sizes.sm
        },
        text: {fontSize: sizes.smallText, fontFamily: fonts.text, color: colors.text},
        button: {
            backgroundColor: colors.primary,
            paddingHorizontal: sizes.sm,
            paddingVertical: sizes.s,
            borderRadius: sizes.s,
            marginRight: sizes.sm
        },
        buttonText: {color: '#fff', fontSize: sizes.h3, fontFamily: fonts.text},
        iconTextContainer: {flexDirection: 'row', alignItems: 'center'},
        icon: {marginRight: sizes.s},
    });

    return (
        <View style={styles.container}>
            <FlatList
                data={settingsOptions.filter(item => item?.show != false)}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <View style={styles.settingItem}>
                        <View style={styles.iconTextContainer}>
                            <MaterialCommunityIcons name={item.icon} size={24} color={colors.primary}
                                                    style={styles.icon}/>
                            <Text style={styles.text}>{item.title}</Text>
                        </View>
                        {item.type === 'switch' ? (
                            <Switch
                                value={item.value}
                                onValueChange={() => item.onToggle()}
                                style={{transform: [{scaleX: Platform.OS === 'android' ? 1.2 : 0.9}, {scaleY: Platform.OS === 'android' ? 1.2 : 0.9}], marginRight: sizes.sm}}
                            />
                        ) : (
                            <TouchableOpacity onPress={item.onPress} style={styles.button}>
                                <Text style={styles.buttonText}>{item?.buttonText}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            />
        </View>
    );
};
export default SettingsScreen;
