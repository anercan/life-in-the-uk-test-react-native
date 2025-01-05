import React from 'react';
import {View, Text, StyleSheet, Dimensions, Image, Platform, TouchableOpacity} from 'react-native';
import {useTheme} from "../hooks";

interface IGroupCard {
    card: any,
    onPress?: () => void;
}

const {height, width} = Dimensions.get('window');

const GroupCard = (props: IGroupCard) => {

    const {fonts, sizes} = useTheme();

    const randomColors = [
        '#9c6565', '#a7a87c',
        '#676782', '#7b637b',
        '#59606a', '#6e9790',
        '#9a8d71', '#80927f',
    ];

    const getRandomColor = () => {
        const randomIndex = Math.floor(Math.random() * randomColors.length);
        return randomColors[randomIndex];
    };

    const styles = StyleSheet.create({
        card: {
            width: sizes.base * 21,
            height: sizes.base * 18,
            backgroundColor: getRandomColor(),
            borderRadius: sizes.m,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: -sizes.md,
            marginHorizontal: sizes.s,
            shadowColor: '#363535',
            shadowOffset: {width: 0, height: 5},
            shadowOpacity: 0.6,
            shadowRadius: 2,
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
            width: sizes.l,
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

    const images = {
        1: require('../assets/icons/groupIcons/icon-1.png'),
        2: require('../assets/icons/groupIcons/icon-2.png'),
        3: require('../assets/icons/groupIcons/icon-3.png'),
        4: require('../assets/icons/groupIcons/icon-4.png'),
        5: require('../assets/icons/groupIcons/icon-5.png'),
        6: require('../assets/icons/groupIcons/icon-6.png'),
        7: require('../assets/icons/groupIcons/icon-7.png'),
        8: require('../assets/icons/groupIcons/icon-8.png'),
        9: require('../assets/icons/groupIcons/icon-9.png'),
        10: require('../assets/icons/groupIcons/icon-10.png'),
        11: require('../assets/icons/groupIcons/icon-11.png'),
        12: require('../assets/icons/groupIcons/icon-12.png')
    };
    const getRandomNumber = (number: number) => {
        return Math.floor(Math.random() * number) + 1;
    };

    return (
        <TouchableOpacity id={`card-${props?.card?.id}`} onPress={props.onPress} >
            <View style={styles.orderBox}>
                <Text style={{color: '#ecebeb', fontSize: sizes.h3}}>
                    {props.card?.userSolvedCount}
                    /
                    <Text style={{
                        color: '#ecebeb',
                        fontSize: sizes.h4
                    }}>
                        {props.card?.quizQuantity}
                    </Text>
                </Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.cardText}>{props.card?.title?.replaceAll(' ', '\n')}</Text>
                <Image style={{
                    position: 'absolute',
                    top: sizes.m,
                    left: 10,
                    zIndex: -2,
                    opacity: 0.1,
                    transform: [{rotate: '-5deg'}] as any, // Rotate the image
                    tintColor: 'white'
                }}
                       source={images[getRandomNumber(Object.keys(images).length)]}>
                </Image>
            </View>
        </TouchableOpacity>
    );
};


export default GroupCard;
