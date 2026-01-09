import React from 'react';
import {View, TouchableOpacity, StyleSheet, StyleProp, ViewStyle,} from 'react-native';

import useTheme from '../hooks/useTheme';
import {AppText} from "components/index";

export interface IButton {
    onPress?: () => void;
    buttonText?: string;
    style?: StyleProp<ViewStyle>;
}

const ButtonCard = (props: IButton) => {
    const {fonts, colors,sizes} = useTheme();

    const styles = StyleSheet.create({
        card: {
            elevation:1,
            backgroundColor: colors.primary,
            borderRadius: sizes.m,
            paddingHorizontal:sizes.m,
            paddingVertical:sizes.sm,
            width: sizes.base * 20,
            margin: sizes.s,
            justifyContent: 'center',
            alignItems: 'center',
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
                <AppText style={styles.buttonText}>{props.buttonText}</AppText>
            </View>
        </TouchableOpacity>
    )
}
export default ButtonCard;
