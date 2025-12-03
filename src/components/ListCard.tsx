import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useTheme} from "../hooks";
import {getShortenText} from "util/commonUtil";
import {AppText} from "components/index";

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
            flexDirection: 'row',
            width: '90%',
            borderWidth: 0.3,
            backgroundColor: colors.card,
            borderRadius: sizes.m,
            marginBottom: sizes.md,
            borderLeftWidth: sizes.s,
            borderBottomRightRadius: sizes.s,
            borderTopRightRadius: sizes.s,
            borderColor: props.locked ? colors.primary : colors.primary,
        },
        iconBox: {
            margin:9,
            marginRight: sizes.sm,
            width: 65,
            height: 65,
            borderRadius: sizes.sm,
            backgroundColor: colors.orderBoxBackGround,
            justifyContent: 'center',
            alignItems: 'center',
        },
        contentBox: {
            flex: 1,
        },
        title: {
            color: props.locked ? colors.light : colors.text,
            fontSize: sizes.h3,
            textAlign: 'auto',
            fontFamily: fonts.semibold,
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
            fontSize: sizes.h4,
            textAlign: 'right',
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
                <AppText style={styles.topText}>
                    {props.rightTopText1}
                    <AppText style={styles.topTextSecondary}>/{props.rightTopText2}</AppText>
                </AppText>
            );
        } else {
            return (
                <AppText style={styles.percentageText}>
                    {props.rightTopText2}
                    <AppText style={{...styles.percentageText, fontSize: sizes.h5}}>%</AppText>
                </AppText>
            );
        }
    };

    return (
        <TouchableOpacity onPress={props.onPress} style={{}}>
            <View style={styles.card}>
                <View style={styles.iconBox}>
                    {renderIconContent()}
                </View>
                <View style={styles.contentBox}>
                    <View style={{flex: 4, justifyContent: 'flex-end'}}>
                        <AppText style={styles.title}>{getShortenText(props.title, 30)}</AppText>
                    </View>
                    <View style={{flex: 1,paddingHorizontal:sizes.s}}>
                        {props.rightBottomDesc && (
                            <AppText style={styles.descText}>{props.rightBottomDesc}</AppText>
                        )}
                    </View>

                </View>

            </View>

        </TouchableOpacity>
    );
};

export default React.memo(ListCard);
