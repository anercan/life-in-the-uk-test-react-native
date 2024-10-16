import React from 'react';
import {Dimensions, View, StyleSheet, Text} from 'react-native';

import {IQuizCard} from '../constants/types';
import {useTheme} from "../hooks";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const {height, width} = Dimensions.get('window');

interface IQuizCard {
    title?:string | undefined,
    rightTopText1?:string | undefined,
    rightTopText2?:string | undefined,
    rightBottomTitle?:string | undefined,
    rightBottomDesc?:string | undefined,
    locked?:boolean | undefined
}

const ListCard = (props:IQuizCard) => {
    const {fonts, colors} = useTheme();

    const styles = StyleSheet.create({
        card: {
            height: height / 10,
            width: width / 1.2,
            backgroundColor: '#f5f4f4',
            padding: 10,
            borderRadius: 13,
            borderLeftWidth: 8,
            borderColor: colors.primary,
            borderWidth: 1,
            borderCurve: 'circular',
            margin: 17,
            shadowColor: '#363535',
            shadowOffset: {width: 1, height: 0},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 5,
        },
        title: {
            color: !props.locked ? '#474747' : '#848383',
            fontSize: 18,
            fontFamily: fonts.h4,
            fontWeight: 'bold',
            marginTop: 9,
            marginLeft:4
        },
        orderBox: {
            height: 35,
            width: props.rightTopText1?.length + props.rightTopText2?.length > 3 ? 50 : 45,
            justifyContent: "center",
            alignItems: 'center',
            borderRadius: 30,
            backgroundColor: '#dddede',
            shadowColor: '#363535',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            marginTop: -25,
            elevation: 5,
            marginLeft: width / 1.45
        },
        orderBoxDate: {
            height: 35,
            width: 85,
            justifyContent: "center",
            alignItems: 'center',
            borderRadius: 30,
            backgroundColor: '#dddede',
            shadowColor: '#363535',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            marginTop: -25,
            elevation: 5,
            marginLeft: width / 1.65
        },
        infoContainer: {
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        rightBottom: {
            flex: 1,
            alignItems: 'flex-end',
            marginTop:-11,
            marginRight:3
        },
        rightBottomTextOne: {
            fontFamily: 'Roboto',
            color: !props.locked ? '#474747' : '#848383',
            fontSize: 14,
            fontWeight: 'bold'
        },
        rightBottomTextTwo: {
            fontFamily: 'Roboto',
            color: !props.locked ? '#474747' : '#848383',
            fontSize: 14,
        },
        text: {
            fontWeight: 'bold',
            color: !props.locked ? '#474747' : '#848383',
            letterSpacing: props.rightTopText1?.length + props.rightTopText2?.length > 2 ? 1 : 2
        },
        dateText: {
            fontWeight: 'bold',
            color: !props.locked ? '#474747' : '#848383',
        }
    });

    return (
        !props.locked ?
        <View style={styles.card}>
            <View style={props.rightTopText1 ? styles.orderBox : styles.orderBoxDate}>
                {props.rightTopText1 !== undefined  ?
                    <Text style={[styles.text, {fontSize: 17}]}>{props.rightTopText1}<Text
                        style={[styles.text, {fontSize: 13}]}>/{props.rightTopText2}</Text>
                    </Text>
                    :
                    <Text style={[styles.dateText, { fontSize: 13 }]}>
                        {props.rightTopText2}
                    </Text>
                }
            </View>
            <Text style={styles.title}>{props.title}</Text>
            <View style={styles.infoContainer}>
                {(props.rightBottomTitle || this.props.rightBottomDesc) &&
                    <View style={styles.rightBottom}>
                        <Text style={styles.rightBottomTextOne}>{props.rightBottomTitle} <Text
                            style={styles.rightBottomTextTwo}>{props.rightBottomDesc}</Text></Text>
                    </View>}
            </View>
        </View>
            :
            <View style={styles.card}>
                <View style={props.rightTopText1 ? styles.orderBox : styles.orderBoxDate}>
                    <MaterialCommunityIcons name="lock" color={'#848383'} size={20}/>
                </View>
                <Text style={styles.title}>{props.title}</Text>
                <View style={styles.infoContainer}>
                    {(props.rightBottomTitle || this.props.rightBottomDesc) &&
                        <View style={styles.rightBottom}>
                            <Text style={styles.rightBottomTextOne}>{props.rightBottomTitle} <Text
                                style={styles.rightBottomTextTwo}>{props.rightBottomDesc}</Text></Text>
                        </View>}
                </View>
            </View>
    );
};

export default ListCard;
