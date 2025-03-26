import React, {useMemo} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

import {useTheme} from "../hooks";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {getShortenText} from "util/commonUtil";

interface IListCard {
    title?: string | undefined,
    rightTopText1?: string | undefined,
    rightTopText2?: string | undefined,
    rightBottomTitle?: string | undefined,
    rightBottomDesc?: string | undefined,
    locked?: boolean | undefined,
    onPress?: () => void;
}

const ListCard = (props:IListCard) => {
    const {fonts, colors, sizes} = useTheme();

    const styles = useMemo(() => StyleSheet.create({
        card: {
            height: sizes.base * 10.6,
            width: '87%',
            backgroundColor: colors.card,
            borderRadius: sizes.sm,
            borderLeftWidth: sizes.s,
            borderColor: colors.primary,
            borderWidth: 1,
            marginBottom:sizes.l ,
            shadowColor: colors.shadow,
            shadowOffset: {width: 1, height: 0},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 5,
            flexDirection:"column",
        },
        orderBoxContainer: {
            flex:2,
            alignItems:"flex-end"
        },
        titleContainer: {
            justifyContent:"center",
            marginLeft:sizes.sm,
            flex:3
        },
        infoContainer: {
            flex:2,
        },
        title: {
            color: !props.locked ? colors.text : colors.light,
            fontSize: sizes.h3,
            fontFamily: fonts.h4,
            fontWeight: 'bold',
        },
        orderBox: {
            height: '150%',
            //flex:1,
            width: '16%',
            justifyContent: "center",
            alignItems: 'center',
            borderRadius: sizes.m,
            backgroundColor: colors.orderBoxBackGround,
            shadowColor: colors.shadow,
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            marginTop: '-5%',
            elevation: 5,
        },
        rightBottom: {
            marginRight:sizes.sm,
            alignItems: 'flex-end',
        },
        rightBottomTextOne: {
            fontFamily: fonts.text,
            color: !props.locked ? colors.text : colors.light,
            fontSize: sizes.h4,
        },
        rightBottomTextTwo: {
            fontFamily: fonts.text,
            color: !props.locked ? colors.text : colors.light,
            fontSize: sizes.h4,
        },
        text: {
            fontFamily:fonts.p,
            color: !props.locked ? colors.text : colors.light,
            letterSpacing: 1
        },
        dateText: {
            fontFamily:fonts.p,
            color: colors.text,
            fontSize:sizes.smallText,
        }
    }), [props.locked]);

    return (
        <TouchableOpacity onPress={props.onPress} style={styles.card}>
                <View style={styles.orderBoxContainer}>
                    <View style={styles.orderBox}>
                        {props.locked ?
                            <MaterialCommunityIcons name="lock" color={colors.light} size={sizes.m}/> :
                            props.rightTopText1 !== undefined ?
                                <Text style={[styles.text, {fontSize: sizes.h1}]}>{props.rightTopText1}<Text
                                    style={[styles.text, {fontSize:  sizes.h5}]}>/{props.rightTopText2}</Text>
                                </Text>
                                :
                                <Text style={styles.dateText}>
                                    <Text style={[styles.dateText, {fontSize:  sizes.h2}]}>
                                        {props.rightTopText2}
                                    </Text>{'%'}
                                </Text>
                        }
                    </View>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{getShortenText(props.title, 30)}</Text>
                </View>
                <View style={styles.infoContainer}>
                    {(props.rightBottomTitle || props.rightBottomDesc) &&
                        <View style={styles.rightBottom}>
                            <Text style={styles.rightBottomTextOne}>{props.rightBottomTitle}
                                <Text style={styles.rightBottomTextTwo}>{props.rightBottomDesc}</Text></Text>
                        </View>}
                </View>
        </TouchableOpacity>
    );
};

export default ListCard;
