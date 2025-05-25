import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../hooks';
import Icon from 'react-native-vector-icons/Ionicons';

const NavigationCard = ({id, header, subText, onPress}) => {
    const {fonts, sizes, colors} = useTheme();

    const styles = StyleSheet.create({
        container: {
            width: '85%',
            height: sizes.xxl,
            alignSelf: 'center',
        },
        card: {
            backgroundColor: colors.card,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: sizes.sm,
            paddingVertical: sizes.s,
            borderRadius: sizes.sm,
            borderLeftWidth: sizes.s,
            borderColor: colors.secondary,
            shadowColor: colors.shadow,
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.15,
            shadowRadius: sizes.m,
            elevation: 4,
        },
        textContainer: {
            flex: 1,
        },
        header: {
            fontFamily: fonts.medium,
            fontSize: sizes.smallText,
            color: colors.secondary,
            marginBottom: sizes.s,
        },
        subText: {
            fontFamily: fonts.text,
            fontSize: sizes.text,
            color: colors.text
        },
        icon: {
        },
    });

    return (
        <TouchableOpacity
            id={id}
            style={styles.container}
            onPress={() => onPress()}
            activeOpacity={0.85}
        >
            <View style={styles.card}>
                <View style={styles.textContainer}>
                    <Text style={styles.header}>{header}</Text>
                    <Text style={styles.subText}>{subText}</Text>
                </View>
                <Icon
                    name="chevron-forward"
                    size={sizes.h2}
                    color={colors.secondary}
                    style={styles.icon}
                />
            </View>
        </TouchableOpacity>
    );
};

export default NavigationCard;
