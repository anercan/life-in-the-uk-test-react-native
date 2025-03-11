import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageProps} from 'react-native';
import {useTheme} from "../hooks";
import Image from "components/Image";

interface IGroupCard {
    card: any,
    onPress?: () => void;
    backgroundColor:string
    backgroundImage:ImageProps
}

const GroupCard = (props: IGroupCard) => {

    const {fonts, sizes} = useTheme();

    const styles = StyleSheet.create({
        card: {
            width: sizes.base * 21,
            height: sizes.base * 18,
            backgroundColor: props.backgroundColor,
            borderRadius: sizes.m,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: -sizes.md,
            marginHorizontal: sizes.s,
            shadowColor: '#363535',
            shadowOffset: {width: 0, height: 3},
            shadowOpacity: 0.5,
            shadowRadius: 3,
            elevation: 4,
        },
        cardText: {
            textAlign: 'center',
            fontFamily: fonts.p,
            fontSize: sizes.h2,
            color: '#f1f0f0'
        },
        orderBox: {
            zIndex: 1,
            height: sizes.l,
            width: getCountLength() > 3 ? sizes.xl : sizes.l,
            justifyContent: "center",
            alignItems: 'center',
            borderRadius: sizes.sm,
            backgroundColor: '#474a50' ,
            shadowColor: '#363535',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 4,
            marginTop: sizes.s,
            marginLeft: sizes.base * 18
        },
    });

    function getCountLength() {
        return props.card?.userSolvedCount?.toString()?.length + props.card?.quizQuantity?.toString()?.length;
    }

    function getProgress() {
        return Math.round((props.card?.userSolvedCount / props.card?.quizQuantity) * 100);
    }

    return (
        <TouchableOpacity id={`card-${props?.card?.id}`} onPress={props.onPress}>
            <View style={styles.orderBox}>
                <Text style={{color: '#ecebeb', fontSize: sizes.h2}}>
                    {getProgress()}
                    <Text style={{
                        color: '#ecebeb',
                        fontSize: sizes.h4
                    }}>
                        %
                    </Text>
                </Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.cardText}>{props.card?.title?.replace(/(?<!\bof|is)\s/g, '\n')}</Text>
                <Image style={{
                    position: 'absolute',
                    top: sizes.m,
                    left: 10,
                    zIndex: -2,
                    opacity: 0.1,
                    transform: [{rotate: '-3deg'}] as any, // Rotate the image
                    tintColor: 'white'
                }}
                       source={props.backgroundImage}>
                </Image>
            </View>
        </TouchableOpacity>
    );
};

export default GroupCard;
