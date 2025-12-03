import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../hooks';
import Icon from 'react-native-vector-icons/Ionicons';
import {AppText} from "components/index";

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
            borderWidth:0.5,
        },
        textContainer: {
            flex: 1,
        },
        header: {
            fontFamily: fonts.medium,
            fontSize: sizes.smallText,
            color: colors.secondary,
            textAlign:'auto',
            marginBottom: sizes.s,
        },
        subText: {
            textAlign: "auto",
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
                    <AppText style={styles.header}>{header}</AppText>
                    <AppText style={styles.subText}>{subText}</AppText>
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
