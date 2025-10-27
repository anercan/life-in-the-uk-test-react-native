import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Switch, TouchableOpacity, StyleSheet, FlatList, Linking, Platform, Share} from 'react-native';
import {useData, useTheme} from "hooks";
import {TitleContext} from "context/TitleContext";
import {AuthContext} from "context/AuthContext";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {isPremium} from "util/jwtUtil";
import {QuizSettingsContext} from "context/QuizSettingsContext";
import Icon from "react-native-vector-icons/Ionicons";
import {logEvent} from "util/logUtil";

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
        setSkipQuestion,
        setPlaySound,
        playSounds
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

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: 'Check out this Quiz App! https://play.google.com/store/apps/details?id=com.quizmarkt.lifeintheuk',
                url: 'https://play.google.com/store/apps/details?id=com.quizmarkt.lifeintheuk'
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    logEvent('shareAction', {type: result.activityType});
                } else {
                    logEvent('shareAction', {});
                }
            } else if (result.action === Share.dismissedAction) {
            }
        } catch (error: any) {
        }
    };

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
                    color: '#e8ae60'
                },
                {
                    icon: 'person-outline',
                    title: 'Profile',
                    buttonText: 'View',
                    color: '#007AFF',
                    onPress: () => navigation.reset({
                        index: 0,
                        routes: [{name: 'ProfileScreens'}]
                    }),
                },
                {
                    icon: 'chatbubble-ellipses-outline',
                    title: 'Leave a Review',
                    buttonText: 'Review',
                    color: '#007AFF',
                    onPress: () => getRequestReview(),
                },
                {
                    icon: 'share-social-outline',
                    title: 'Share',
                    buttonText: 'Share',
                    color: '#007AFF',
                    onPress: () => onShare(),
                },
                {
                    icon: 'document-text-outline',
                    title: 'Privacy Policy',
                    buttonText: 'Review',
                    color: '#007AFF',
                    onPress: () => Linking.openURL('https://quizmarkt.com/life-in-the-uk/privacy-policy.html'),
                },
                {
                    icon: 'exit-outline',
                    title: 'Logout',
                    buttonText: 'Logout',
                    color: '#c63f3f',
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
                    color: '#007AFF',
                    onToggle: () => setIsDark(!isDark),
                },
                {
                    icon: 'play-skip-forward-outline',
                    title: 'Skip Questions Fast',
                    hasSwitch: true,
                    value: skipQuestionImmediately,
                    color: '#007AFF',
                    onToggle: () => setSkipQuestion(!skipQuestionImmediately),
                },
                {
                    icon: 'checkmark-outline',
                    title: 'Show Correct Answer',
                    hasSwitch: true,
                    value: showCorrectAnswer,
                    color: '#007AFF',
                    onToggle: () => toggleCorrectAnswer(),
                },
                {
                    icon: 'document-text-outline',
                    title: 'Show Explanation',
                    hasSwitch: true,
                    value: showExplanationWhileSolving,
                    color: '#007AFF',
                    onToggle: () => toggleShowExplanationOnlyReview(),
                },
                {
                    icon: 'volume-medium-outline',
                    title: 'Mute Effects',
                    hasSwitch: true,
                    value: !playSounds,
                    color: '#007AFF',
                    onToggle: () => setPlaySound((prev) => !prev),
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

    const getLine = () => {
        return <View style={{
            height: 1,
            backgroundColor: colors.tabBackground,
            alignSelf: 'stretch',
        }}/>;
    }

    return (
        <View>
            <FlatList
                data={settingsOptions}
                renderItem={({item}) => {
                    // @ts-ignore
                    const itemSize = item.items.filter((setting: any) => setting?.show !== false)?.length;
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
                            {// @ts-ignore
                                item.items?.filter((setting: any) => setting?.show !== false).map((setting, idx) => (
                                    <React.Fragment key={idx}>
                                        {idx !== 0 && getLine()}
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
                                                        backgroundColor: setting.color,
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
                                    </React.Fragment>
                                ))}
                        </View>
                    );
                }}
            />
        </View>
    );
};
export default SettingsScreen;
