import React, {useMemo} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

import {useTheme} from "../hooks";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {getShortenText} from "util/CommonUtil";

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
            backgroundColor: '#f5f4f4',
            borderRadius: sizes.sm,
            borderLeftWidth: sizes.s,
            borderColor: colors.primary,
            borderWidth: 1,
            marginBottom:sizes.l ,
            shadowColor: '#363535',
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
            color: !props.locked ? '#474747' : '#848383',
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
            backgroundColor: '#dddede',
            shadowColor: '#363535',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            marginTop: '-5%',
            elevation: 5,
        },
        orderBoxDate: {
            height: '150%',
            width: '22%',
            justifyContent: "center",
            alignItems: 'center',
            borderRadius: sizes.m,
            backgroundColor: '#dddede',
            shadowColor: '#363535',
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
            color: !props.locked ? '#474747' : '#848383',
            fontSize: sizes.h4,
        },
        rightBottomTextTwo: {
            fontFamily: fonts.text,
            color: !props.locked ? '#474747' : '#848383',
            fontSize: sizes.h4,
        },
        text: {
            fontFamily:fonts.p,
            color: !props.locked ? '#5c5b5b' : '#848383',
            letterSpacing: props.rightTopText1?.length + props.rightTopText2?.length > 2 ? 1 : 2
        },
        dateText: {
            fontWeight: 'bold',
            color: !props.locked ? '#525252' : '#848383',
        }
    }), [props.locked]);

    return (
        <TouchableOpacity onPress={props.onPress} style={styles.card}>
                <View style={styles.orderBoxContainer}>
                    <View style={props.rightTopText1 ? styles.orderBox : styles.orderBoxDate}>
                        {props.locked ?
                            <MaterialCommunityIcons name="lock" color={'#848383'} size={sizes.m}/> :
                            props.rightTopText1 !== undefined ?
                                <Text style={[styles.text, {fontSize: sizes.h2}]}>{props.rightTopText1}<Text
                                    style={[styles.text, {fontSize:  sizes.h5}]}>/{props.rightTopText2}</Text>
                                </Text>
                                :
                                <Text style={[styles.dateText, {fontSize: sizes.inputPadding}]}>
                                    {props.rightTopText2}
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
