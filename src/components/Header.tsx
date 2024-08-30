import React from 'react';
import {View, Image, StyleSheet, StatusBar, Platform} from 'react-native';

const Header = () => {
    return (
        <View style={styles.headerContainer}>
            <StatusBar backgroundColor="#012169" barStyle="light-content"/>
            <Image
                source={require('./../../assets/img.png')}
                style={styles.logo}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: 55,  // Smaller height for the header to allow for more overflow
        backgroundColor: '#012169',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'visible',  // Ensure overflow is visible
        marginBottom: 50,
    },
    logo: {
        width: 75,  // Width of the logo
        height: 75, // Height of the logo
        borderRadius: 50,  // Circle shape
        position: 'absolute',
        top: 25,  // Move the logo up so that half of it is outside the header
    },
});

export default Header;
