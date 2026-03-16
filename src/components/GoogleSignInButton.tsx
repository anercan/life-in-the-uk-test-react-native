import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {useTheme} from '../hooks';
import AppText from './AppText';
import Image from './Image';

interface GoogleSignInButtonProps {
    onPress: () => void;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({onPress}) => {
    const {fonts, sizes} = useTheme();

    const styles = StyleSheet.create({
        button: {
            borderRadius: sizes.xl,
            elevation: 1,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 0.5,
            backgroundColor: '#546b81',
            height: sizes.xl,
            width: sizes.base * 35,
            paddingVertical: sizes.xs,
            paddingHorizontal: sizes.xs,
        },
        iconContainer: {
            backgroundColor: '#fff',
            borderRadius: sizes.xxxl,
            width: sizes.base * 4,
            height: sizes.base * 4,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: sizes.m,
            marginLeft: sizes.s,
        },
        iconImage: {
            resizeMode: 'center',
            width: sizes.base * 3,
            height: sizes.base * 3,
        },
        text: {
            color: '#fff',
            fontFamily: fonts.p,
            fontSize: sizes.text,
            fontWeight: 'thin',
        },
    });

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <View style={styles.iconContainer}>
                <Image
                    style={styles.iconImage}
                    source={require('../assets/icons/google2.png')}
                />
            </View>
            <AppText style={styles.text}>Sign in with Google</AppText>
        </TouchableOpacity>
    );
};

