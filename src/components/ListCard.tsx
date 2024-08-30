import React from 'react';
import {Dimensions, View, StyleSheet, Text} from 'react-native';

import {IQuizCard} from '../constants/types';
import {useTheme} from "../hooks";

const {height, width} = Dimensions.get('window');

interface IQuizCard {
    title?:string | undefined,
    rightTopText1?:string | undefined,
    rightTopText2?:string | undefined,
    rightBottomTitle?:string | undefined,
    rightBottomDesc?:string | undefined,
}

const ListCard = (props:IQuizCard) => {
    const {fonts, colors} = useTheme();

    const styles = StyleSheet.create({
        card: {
            height: height / 10,
            width: width / 1.2,
            backgroundColor: '#ececec',
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
            color: '#404040',
            fontSize: 17,
            fontFamily: fonts.h4,
            fontWeight: 'bold',
            marginTop: 9,
            marginLeft:4
        },
        orderBox: {
            height: 35,
            width: 45,
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
        description: {
            fontFamily: fonts.thin,
            fontSize: 13,
            marginTop: 5,
        },
        infoContainer: {
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        righBottom: {
            flex: 1,
            alignItems: 'flex-end',
            marginTop:-7,
            marginRight:3
        },
        rightBottomTextOne: {
            fontFamily: 'Roboto',
            color: '#4c4c4c',
            fontSize: 14,
            fontWeight: 'bold'
        },
        rightBottomTextTwo: {
            fontFamily: 'Roboto',
            color: '#4c4c4c',
            fontSize: 14,
        },
    });

    return (
        <View style={styles.card}>
            <View style={styles.orderBox}>
                <Text style={{fontWeight:'bold',color:'#5a5a5a',fontSize:16}}>
                    {props.rightTopText1}
                    /
                    <Text style={{fontWeight:'bold',color:'#5a5a5a',fontSize:13}}>{props.rightTopText1}</Text>
                </Text>

            </View>
            <Text style={styles.title}>{props.title}</Text>
            <View style={styles.infoContainer}>
                {(props.rightBottomTitle || this.props.rightBottomDesc) &&
                    <View style={styles.righBottom}>
                        <Text style={styles.rightBottomTextOne}>{props.rightBottomTitle} <Text
                            style={styles.rightBottomTextTwo}>{props.rightBottomDesc}</Text></Text>
                    </View>}
            </View>
        </View>
    );
};

export default ListCard;
