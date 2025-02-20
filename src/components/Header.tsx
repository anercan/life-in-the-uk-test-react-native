import React, {useContext} from 'react';
import {View, Text, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useTheme} from "../hooks";
import {TitleContext} from "context/TitleContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {useNavigation} from '@react-navigation/native';
import {getShortenText} from "util/CommonUtil";

const Header = () => {
    const {getTitle} = useContext(TitleContext);
    const {fonts,colors,sizes} = useTheme();
    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.goBack();
    };

    const styles = StyleSheet.create({
        headerContainer: {
            height: sizes.base * 13,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',

            // iOS shadow
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.3,
            shadowRadius: 4,

            // Android shadow
            elevation: 4,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
        },
        backButton: {
            marginTop: sizes.l,
            padding: sizes.xs,
            zIndex: 1
        }
    });

    return (
        <View style={styles.headerContainer}>
            <StatusBar backgroundColor={colors.primary}/>
            <View style={styles.row}>
                {navigation.canGoBack() &&
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <MaterialCommunityIcons name='arrow-left' color={'#e8e8e8'} size={sizes.md}/>
                    </TouchableOpacity>}
                <Text style={{
                    marginTop: sizes.l,
                    marginLeft: navigation.canGoBack() ? -sizes.l : 0,
                    fontFamily: fonts.p,
                    textAlign: 'center',
                    fontSize: sizes.h1,
                    color: '#e8e8e8',
                    flex: 1,
                }}>
                    {getShortenText(getTitle(),27)}
                </Text>
            </View>
        </View>
    );
};

export default Header;
