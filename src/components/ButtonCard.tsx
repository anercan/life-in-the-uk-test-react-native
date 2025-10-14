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
            borderRadius: sizes.sm,
            paddingHorizontal:sizes.m,
            paddingVertical:sizes.sm,
            width: sizes.base * 20,
            margin: sizes.s,
            justifyContent: 'center', //Centered vertically
            alignItems: 'center', //Centered horizontally
            borderWidth:1,
            borderColor:colors.cardBorder,
        }, buttonText: {
            color: colors.white,
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
