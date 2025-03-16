import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle,} from 'react-native';

import useTheme from '../hooks/useTheme';

export interface IButton {
    onPress?: () => void;
    buttonText?: string;
    style?: StyleProp<ViewStyle>;
}

const ButtonCard = (props: IButton) => {
    const {fonts, colors,sizes} = useTheme();

    const styles = StyleSheet.create({
        card: {
            backgroundColor: colors.primary,
            borderRadius: sizes.xl,
            paddingHorizontal:sizes.m,
            paddingVertical:sizes.sm,
            width: sizes.base * 20,
            margin: sizes.s,
            shadowColor: '#363535',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 3,
            justifyContent: 'center', //Centered vertically
            alignItems: 'center', //Centered horizontally
        }, buttonText: {
            color: '#f8f8f8',
            fontSize: sizes.h3,
            fontFamily: fonts.semibold,
            justifyContent: 'center',
        }
    });

    const onPress = () => {
        if (props?.onPress) {
            props?.onPress();
        }
    }

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.card, props.style]}>
                <Text style={styles.buttonText}>{props.buttonText}</Text>
            </View>
        </TouchableOpacity>
    )
}
export default ButtonCard;
