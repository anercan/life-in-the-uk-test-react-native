import React from 'react';
import {View, Image, StyleSheet, StatusBar, Platform} from 'react-native';

const Header = () => {
    return (
        <View style={styles.headerContainer}>
            <StatusBar backgroundColor="#012169"/>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: 15,  // Smaller height for the header to allow for more overflow
        backgroundColor: '#012169',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 60,
    },
    logo: {
        width: 75,  // Width of the logo
        height: 75, // Height of the logo
        borderRadius: 50,  // Circle shape
        position: 'absolute',
        top: 25,  // Move the logo up so that half of it is outside the header
        zIndex:999
    },
});

export default Header;
