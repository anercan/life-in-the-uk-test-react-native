import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Switch, TouchableOpacity, StyleSheet, FlatList, Linking, Platform} from 'react-native';
import {useData, useTheme} from "hooks";
import {TitleContext} from "context/TitleContext";
import {AuthContext} from "context/AuthContext";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {isPremium} from "util/jwtUtil";
import {QuizSettingsContext} from "context/QuizSettingsContext";
import Icon from "react-native-vector-icons/Ionicons";

const SettingsScreen = ({navigation}) => {
    const {setTitle} = useContext(TitleContext);
    const {fonts, colors, sizes} = useTheme();
    const {isDark, setIsDark} = useData();
    const {logout} = useContext(AuthContext);
    const {
        setExplanationWhileSolving,
        setCorrectAnswer,
        showCorrectAnswer,
        showExplanationWhileSolving,
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

    const getRequestReview = () => {
        if (Platform.OS == "android") {
            Linking.openURL('market://details?id=com.quizmarkt.lifeintheuk');
        }
        return;
    }

    const settingsOptions = [
        {
            section: 'Account',
            items: [
                {
                    icon: 'key-outline',
                    title: 'Get Premium+',
                    buttonText: 'View',
                    onPress: () => navigation.push('GetPremiumScreen'),
                    show: !isPremiumUser,
                    color:'#e8ae60'
                },
                {
                    icon: 'person-outline',
                    title: 'Profile',
                    buttonText: 'View',
                    color:'#007AFF',
                    onPress: () => navigation.reset({
                        index: 0,
                        routes: [{name: 'ProfileScreens'}]
                    }),
                },
                {
                    icon: 'chatbubble-ellipses-outline',
                    title: 'Leave a Review',
                    buttonText: 'Review',
                    color:'#007AFF',
                    onPress: () => getRequestReview(),
                },
                {
                    icon: 'document-text-outline',
                    title: 'Privacy Policy',
                    buttonText: 'Review',
                    color:'#007AFF',
                    onPress: () => Linking.openURL('https://quizmarkt.com/life-in-the-uk/privacy-policy.html'),
                },
                {
                    icon: 'exit-outline',
                    title: 'Logout',
                    buttonText: 'Logout',
                    color:'#c63f3f',
                    onPress: () => logoutInternal(),
                },
            ],
        },
        {
            section: 'Preferences',
            items: [
                {
                    icon: 'moon-outline',
                    title: 'Dark Mode',
                    hasSwitch: true,
                    value: isDark,
                    color:'#007AFF',
                    onToggle: () => setIsDark(!isDark),
                },
                {
                    icon: 'play-skip-forward-outline',
                    title: 'Skip Question Immediately',
                    hasSwitch: true,
                    value: skipQuestionImmediately,
                    color:'#007AFF',
                    onToggle: () => setSkipQuestion(!skipQuestionImmediately),
                },
                {
                    icon: 'checkmark-outline',
                    title: 'Show Correct After Incorrect',
                    hasSwitch: true,
                    value: showCorrectAnswer,
                    color:'#007AFF',
                    onToggle: () => toggleCorrectAnswer(),
                },
                {
                    icon: 'document-text-outline',
                    title: 'Show Explanation After Incorrect',
                    hasSwitch: true,
                    value: showExplanationWhileSolving,
                    color:'#007AFF',
                    onToggle: () => toggleShowExplanationOnlyReview(),
                },
            ],
        },
    ];

    const logoutInternal = async () => {
        logout();
        await GoogleSignin.signOut();
    }


    const styles = StyleSheet.create({
        text: {fontSize: sizes.smallText, fontFamily: fonts.text, color: colors.text},
    });

    return (
        <View>
            <FlatList
                data={settingsOptions}
                renderItem={({item}) => {
                    const itemSize = item.items.length;
                    return (
                        <View style={{marginVertical: sizes.s, paddingHorizontal: sizes.sm}}>
                            <Text style={{
                                color: colors.text,
                                marginHorizontal: 16,
                                marginBottom: 8,
                                fontFamily: fonts.semibold,
                                fontSize: sizes.text
                            }}>
                                {item.section}
                            </Text>
                            {item.items.map((setting, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    onPress={setting.onPress}
                                    activeOpacity={setting.hasSwitch ? 1 : 0.5}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingHorizontal: 14,
                                        paddingVertical: 12,
                                        backgroundColor: colors.card,
                                        borderBottomWidth: 0.5,
                                        borderBottomColor: colors.cardBorder,
                                        borderTopLeftRadius: idx == 0 ? sizes.m : 0,
                                        borderTopRightRadius: idx == 0 ? sizes.m : 0,
                                        borderBottomLeftRadius: idx == itemSize - 1 ? sizes.m : 0,
                                        borderBottomRightRadius: idx == itemSize - 1 ? sizes.m : 0
                                    }}
                                >
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <View
                                            style={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: sizes.s,
                                                backgroundColor: setting.color, // Mavi Apple tarzı arka plan rengi
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: 12,
                                            }}
                                        >
                                            <Icon name={setting.icon as any} size={18} color="#fff"/>
                                        </View>
                                        <Text style={styles.text}>{setting.title}</Text>
                                    </View>
                                    {setting.hasSwitch ? (
                                        <Switch
                                            value={setting.value}
                                            onValueChange={setting.onToggle}
                                        />
                                    ) : (
                                        <Icon name="chevron-forward" size={18} color="#999"/>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                    );
                }}
            />
        </View>
    );
};
export default SettingsScreen;
