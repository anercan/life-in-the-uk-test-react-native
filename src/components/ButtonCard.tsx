import React from 'react';
import {
    View, Text, Dimensions, TouchableOpacity,
} from 'react-native';

import useTheme from '../hooks/useTheme';

export interface IButton {
    onPress?: () => void;
    buttonText?: string;
}

const {height, width} = Dimensions.get('window');
const ButtonCard = (props: IButton) => {
    const {fonts} = useTheme();

    const styles = {
        card: {
            height: height / 15,
            width: width / 1.5,
            backgroundColor: '#b2f6f6',
            padding: 10,
            borderRadius: 7,
            margin: 8,
            shadowColor: '#363535',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 5,
            justifyContent: 'center', //Centered vertically
            alignItems: 'center', //Centered horizontally
        }, buttonText: {
            color: '#404040',
            fontSize: 16,
            fontFamily: fonts.medium,
            fontWeight: 'bold',
            justifyContent: 'center',
        }
    };

    const onPress = () => {
        if (props?.onPress) {
            props?.onPress();
        }
    }

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.card}>
                <Text style={styles.buttonText}>{props.buttonText}</Text>
            </View>
        </TouchableOpacity>
    )
}
export default ButtonCard;
