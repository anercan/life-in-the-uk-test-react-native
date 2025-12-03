import React from 'react';
import {View, StyleSheet, TouchableOpacity, ImageProps, Dimensions} from 'react-native';
import {useTheme} from "../hooks";
import Image from "components/Image";
import {AppText} from "components/index";

interface IGroupCard {
    card: any,
    onPress?: () => void;
    backgroundColor: string
    backgroundImage: ImageProps
}

const {width} = Dimensions.get('window');

const GroupCard = (props: IGroupCard) => {

    const {fonts, sizes, colors} = useTheme();

    const cardWidth = width / 2.4;
    const styles = StyleSheet.create({
        container: {
            margin: sizes.xs,
            marginHorizontal: 9,
        },
        card: {
            borderWidth:1,
            borderColor:props.backgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
            width: cardWidth,
            height: cardWidth / 1.15,
            backgroundColor: props.backgroundColor,
            borderRadius: sizes.sm,
            shadowColor: colors.shadow,
        },
        cardText: {
            textAlign: 'center',
            fontFamily: fonts.p,
            fontSize: sizes.h2,
            color: colors.gray
        },
        orderBox: {
            borderColor:props.backgroundColor,
            zIndex: 1,
            borderRadius: sizes.sm,
            backgroundColor: '#474a50',
            padding:1,
            marginBottom: -sizes.md,
            marginRight: -sizes.s,
            alignItems: "flex-end"
        }, orderBoxText: {
            color: colors.gray,
            fontSize: sizes.h2,
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
                    <AppText style={styles.orderBoxText}>
                        {getProgress()}
                        <AppText style={{
                            color: '#ecebeb',
                            fontSize: sizes.h4,
                            fontFamily:fonts.text
                        }}>
                            %
                        </AppText>
                    </AppText>
                </View>
            </View>
            <View style={styles.card}>
                <AppText style={styles.cardText}>{props.card?.title?.replace(/(?<!\bof|is)\s/g, '\n')}</AppText>
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

export default React.memo(GroupCard);
