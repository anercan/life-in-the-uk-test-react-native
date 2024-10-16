import React from 'react';
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native';
import {useTheme} from "../hooks";

const {width} = Dimensions.get('window');


interface IGroupCard {
    card: any
}

const GroupCard = (props: IGroupCard) => {

    const {fonts} = useTheme();

    const colors = [
        '#3d2f2f', '#444538',
        '#434352', '#534453',
        '#4b5f5e', '#555848',
        '#44455a', 'rgba(78,61,61,0.99)',
    ];

    const getRandomColor = () => {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

    const styles = StyleSheet.create({
        card: {
            width: (width / 2) - 30, // Adjust width for two columns
            height: 120, // Adjust height as needed
            backgroundColor: getRandomColor(),
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 10,
            shadowColor: '#363535',
            shadowOffset: {width: 0, height: 5},
            shadowOpacity: 0.6,
            shadowRadius: 2,
            elevation: 4,
        },
        cardText: {
            fontFamily:fonts.medium,
            fontSize: 18,
            marginTop: 15,
            color: '#eeeeee'
        },
        orderBox: {
            height: 35,
            width: 45,
            justifyContent: "center",
            alignItems: 'center',
            borderRadius: 30,
            backgroundColor: '#e3e3e3',
            shadowColor: '#363535',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 5,
            marginTop: -70,
            marginRight: -155
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
        <View style={styles.card}>
            <View style={styles.orderBox}>
                <Text style={{fontWeight: 'bold', color: '#5a5a5a', fontSize: 16}}>
                    {props.card?.userSolvedCount}
                    /
                    <Text style={{
                        fontWeight: 'bold',
                        color: '#5a5a5a',
                        fontSize: 13
                    }}>
                        {props.card?.quizQuantity}
                    </Text>
                </Text>
            </View>
            <Text style={styles.cardText}>{props.card?.title}</Text>
            <Image style={{
                position: 'absolute',
                top: 50,
                left: 0,
                zIndex: -2,
                opacity: 0.1,
                transform: [{rotate: '-5deg'}] as any, // Rotate the image
                tintColor: 'white'
            }}
                   source={images[getRandomNumber(Object.keys(images).length)]}>
            </Image>
        </View>
    );
};


export default GroupCard;
