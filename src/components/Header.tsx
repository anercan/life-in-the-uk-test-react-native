import React, {useContext} from 'react';
import {View, Image, StyleSheet, StatusBar, Platform, Text, Dimensions} from 'react-native';
import {useTheme} from "../hooks";
import {TitleContext} from "../context/TitleContext";
import {useRoute} from "@react-navigation/native";

const {height} = Dimensions.get('window');

const Header = () => {
    const {getTitle} = useContext(TitleContext);
    const {fonts} = useTheme();

    return (
        <View style={styles.headerContainer}>
            <StatusBar backgroundColor="#012169"/>
            <View>
                <Text style={{
                    marginTop: 35,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                    fontSize: 23,
                    color: '#e3e3e3'
                }}> {getTitle()} </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: height / 9,  // Smaller height for the header to allow for more overflow
        backgroundColor: '#012169',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 20,
    },
    logo: {
        width: 75,  // Width of the logo
        height: 75, // Height of the logo
        borderRadius: 50,  // Circle shape
        position: 'absolute',
        top: 25,  // Move the logo up so that half of it is outside the header
        zIndex: 999
    },
});

export default Header;
