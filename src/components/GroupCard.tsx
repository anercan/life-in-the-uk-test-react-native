import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageProps, Dimensions} from 'react-native';
import {useTheme} from "../hooks";
import Image from "components/Image";

interface IGroupCard {
    card: any,
    onPress?: () => void;
    backgroundColor: string
    backgroundImage: ImageProps
}

const {width} = Dimensions.get('window');

const GroupCard = (props: IGroupCard) => {

    const {fonts, sizes, colors} = useTheme();

    const cardWidth = width / 2.5;
    const styles = StyleSheet.create({
        container: {
            margin: sizes.xs,
            marginHorizontal: 10,
        },
        card: {
            alignItems: 'center',
            justifyContent: 'center',
            width: cardWidth,
            height: cardWidth / 1.15,
            backgroundColor: props.backgroundColor,
            borderRadius: sizes.md,
            shadowColor: colors.shadow,
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 4,
        },
        cardText: {
            textAlign: 'center',
            fontFamily: fonts.p,
            fontSize: sizes.h2,
            color: colors.gray
        },
        orderBox: {
            zIndex: 1,
            borderRadius: sizes.sm,
            backgroundColor: '#474a50',
            shadowColor: colors.shadow,
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 2,
            marginBottom: -sizes.md,
            marginRight: -sizes.s,
            alignItems: "flex-end"
        }, orderBoxText: {
            color: colors.gray,
            fontSize: sizes.h2,
            fontFamily: fonts.text,
            alignItems: 'center',
            paddingVertical: sizes.s,
            paddingHorizontal: sizes.s
        }
    });

    function getProgress() {
        return Math.round((props.card?.userSolvedCount / props.card?.quizQuantity) * 100);
    }

    return (
        <TouchableOpacity id={`card-${props?.card?.id}`} style={styles.container} onPress={props.onPress}>
            <View style={{alignItems: 'flex-end'}}>
                <View style={styles.orderBox}>
                    <Text style={styles.orderBoxText}>
                        {getProgress()}
                        <Text style={{
                            color: '#ecebeb',
                            fontSize: sizes.h4
                        }}>
                            %
                        </Text>
                    </Text>
                </View>
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
