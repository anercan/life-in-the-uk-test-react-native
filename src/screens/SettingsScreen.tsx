import React, {useContext, useEffect} from 'react';
import {View, Text, Switch, TouchableOpacity, StyleSheet, FlatList, Linking} from 'react-native';
import {useData, useTheme} from "hooks";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {TitleContext} from "context/TitleContext";
import {AuthContext} from "context/AuthContext";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import useQuizSettings from "hooks/useQuizSettings";

const SettingsScreen = () => {
    const {setTitle} = useContext(TitleContext);
    const {fonts, colors, sizes} = useTheme();
    const {isDark, setIsDark} = useData();
    const {logout} = useContext(AuthContext);
    const {showExplanationWhileReview, setShowExplanationWhileReview} = useQuizSettings();

    useEffect(() => {
        setTitle('Settings');
    }, []);

    const settingsOptions = [
        {
            id: '1',
            title: 'Dark Mode',
            icon: 'theme-light-dark',
            type: 'switch',
            value: isDark,
            onToggle: () => isDark ? setIsDark(false) : setIsDark(true)
        },
        {
            id: '2',
            title: 'Show Explanations When Review',
            icon: 'card-text-outline',
            type: 'switch',
            value: showExplanationWhileReview,
            onToggle: setShowExplanationWhileReview
        },
        {
            id: '3',
            title: 'Privacy Policy',
            buttonText: 'View',
            icon: 'gavel',
            type: 'button',
            onPress: () => Linking.openURL('https://quizmarkt.com/life-in-the-uk/privacy-policy.html')
        },
        {
            id: '4',
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
                data={settingsOptions}
                ItemSeparatorComponent={() => <View style={{height: sizes.s}}/>}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <View style={styles.settingItem}>
                        <View style={styles.iconTextContainer}>
                            <MaterialCommunityIcons name={item.icon} size={26} color={colors.primary}
                                                    style={styles.icon}/>
                            <Text style={styles.text}>{item.title}</Text>
                        </View>
                        {item.type === 'switch' ? (
                            <Switch
                                value={item.value}
                                onValueChange={(newValue) => item.onToggle(newValue)}
                                style={{transform: [{scaleX: 1.4}, {scaleY: 1.4}], marginRight: sizes.sm}}
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
