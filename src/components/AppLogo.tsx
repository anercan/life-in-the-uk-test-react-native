import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../hooks';
import Image from './Image';

interface AppLogoProps {
    size?: number;
}

export const AppLogo: React.FC<AppLogoProps> = ({size}) => {
    const {sizes} = useTheme();
    const logoSize = size ?? sizes.base * 20;

    const styles = StyleSheet.create({
        logoContainer: {
            width: logoSize,
            height: logoSize,
            borderRadius: sizes.xxl,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: '#cecece',
        },
        logo: {
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
        },
    });

    return (
        <View style={styles.logoContainer}>
            <Image
                source={require('../assets/images/lifeintheukapp-logo.png')}
                style={styles.logo}
            />
        </View>
    );
};

