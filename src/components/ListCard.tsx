import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useTheme} from "../hooks";
import {getShortenText} from "util/commonUtil";

interface IListCard {
    title?: string;
    rightTopText1?: string;
    rightTopText2?: string;
    rightBottomDesc?: string;
    locked?: boolean;
    onPress?: () => void;
}

const ListCard = (props: IListCard) => {
    const {fonts, colors, sizes} = useTheme();

    const styles = StyleSheet.create({
        card: {
            width: '90%',
            backgroundColor: colors.card,
            borderRadius: sizes.sm,
            marginBottom: sizes.md,
            borderLeftWidth: sizes.s,
            borderColor: colors.primary,
            shadowColor: colors.shadow,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.1,
            shadowRadius: sizes.shadowRadius,
            elevation: 3,
            padding: sizes.sm,
            flexDirection: 'row',
            alignItems: 'center',
        },
        iconBox: {
            width: 60,
            height: 60,
            borderRadius: sizes.s,
            backgroundColor: colors.orderBoxBackGround,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: colors.shadow,
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.1,
            shadowRadius: sizes.shadowRadius,
            elevation: 1.5,
            marginRight: sizes.sm,
        },
        contentBox: {
            flex: 1,
            justifyContent: 'center',
        },
        title: {
            color: props.locked ? colors.light : colors.text,
            fontSize: sizes.h3,
            fontFamily: fonts.semibold,
            marginBottom: 4,
        },
        topText: {
            fontFamily: fonts.semibold,
            fontSize: sizes.h2,
            color: props.locked ? colors.light : colors.text,
        },
        percentageText: {
            fontFamily: fonts.semibold,
            fontSize: sizes.h2,
            color: props.locked ? colors.light : colors.text,
        },
        descText: {
            fontFamily: fonts.text,
            fontSize: sizes.h4,
            color: props.locked ? colors.light : colors.secondary,
            marginTop: 2,
        },
        topTextSecondary: {
            fontFamily: fonts.semibold,
            fontSize: sizes.h5,
            color: props.locked ? colors.light : colors.text,
        },
    });

    const renderIconContent = () => {
        if (props.locked) {
            return <MaterialCommunityIcons name="lock" color={colors.light} size={sizes.m}/>;
        } else if (props.rightTopText1 !== undefined) {
            return (
                <Text style={styles.topText}>
                    {props.rightTopText1}
                    <Text style={styles.topTextSecondary}>/{props.rightTopText2}</Text>
                </Text>
            );
        } else {
            return (
                <Text style={styles.percentageText}>
                    {props.rightTopText2}
                    <Text style={{...styles.percentageText, fontSize: sizes.h5}}>%</Text>
                </Text>
            );
        }
    };

    return (
        <TouchableOpacity onPress={props.onPress} style={styles.card}>
            <View style={styles.iconBox}>
                {renderIconContent()}
            </View>
            <View style={styles.contentBox}>
                <Text style={styles.title}>{getShortenText(props.title, 30)}</Text>
                {props.rightBottomDesc && (
                    <Text style={styles.descText}>{props.rightBottomDesc}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default React.memo(ListCard);
