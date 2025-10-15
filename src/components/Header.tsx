import React, {useContext} from 'react';
import {View, Text, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useTheme} from "../hooks";
import {TitleContext} from "context/TitleContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {useNavigation} from '@react-navigation/native';
import {getShortenText} from "util/commonUtil";
import {AuthContext} from "context/AuthContext";
import {SafeAreaView} from "react-native-safe-area-context";

const Header = () => {
    const {getTitle} = useContext(TitleContext);
    const {fonts, colors, sizes} = useTheme();
    const navigation = useNavigation();
    const {isLoggedIn} = useContext(AuthContext);

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleSettings = () => {
        // @ts-ignore
        navigation?.navigate('SettingsScreen');
    };

    const styles = StyleSheet.create({
        headerContainer: {
            justifyContent: "flex-end",
            height: '11%',
            backgroundColor: colors.background
        },
        row: {
            flexDirection: 'row',
            marginBottom: sizes.s
        }, title: {
            fontFamily: fonts.text,
            textAlign: 'center',
            fontSize: sizes.h1,
            color: colors.gray
        }
    });

    return (
        <SafeAreaView style={styles.headerContainer}>
            <StatusBar backgroundColor={colors.background}/>
            {isLoggedIn &&
                <View style={styles.row}>
                    <View style={{flex: 1}}>
                        {navigation.canGoBack() &&
                            <TouchableOpacity onPress={handleBackPress} style={{marginLeft: sizes.s}}>
                                <MaterialCommunityIcons name='arrow-left' color={colors.gray} size={sizes.md}/>
                            </TouchableOpacity>}
                    </View>
                    <View style={{flex: 5}}>
                        <Text style={styles.title}>
                            {getShortenText(getTitle(), 20)}
                        </Text>
                    </View>
                    <View style={{flex: 1}}>
                        <TouchableOpacity onPress={handleSettings} style={{marginLeft: sizes.s}}>
                            <MaterialCommunityIcons name='tune' color={colors.gray} size={sizes.md}/>
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </SafeAreaView>
    );
};

export default Header;
