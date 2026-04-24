import React from 'react';
import {View, StyleSheet, TouchableOpacity, Animated, Platform, Dimensions} from 'react-native';
import {useTheme} from '../hooks';
import Icon from 'react-native-vector-icons/Ionicons';
import {AppText} from "components/index";
import LinearGradient from 'react-native-linear-gradient';
import {buttonPressInConfig, buttonPressOutConfig} from "util/commonUtil";

const {width} = Dimensions.get('window');

const NavigationCard = ({id, header, subText, onPress}) => {
    const {fonts, sizes} = useTheme();
    const [pressAnim] = React.useState(new Animated.Value(1));

    const cardWidth = width * 0.92;

    const handlePressIn = () => {
        Animated.spring(pressAnim, buttonPressInConfig).start();
    };

    const handlePressOut = () => {
        Animated.spring(pressAnim, buttonPressOutConfig).start();
    };

    const styles = StyleSheet.create({
        container: {
            alignSelf: 'center',
        },
        cardShadow: {
            borderRadius: sizes.cardRadius,
            ...Platform.select({
                ios: {
                    shadowColor: '#0D47A1',
                    shadowOffset: {width: 0, height: 6},
                    shadowOpacity: 0.25,
                    shadowRadius: 12,
                },
                android: {
                    elevation: 8,
                },
            }),
        },
        card: {
            width: cardWidth,
            borderRadius: sizes.cardRadius,
            overflow: 'hidden',
        },
        gradient: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        leftContent: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        iconContainer: {
            width: sizes.l,
            height: sizes.l,
            borderRadius: sizes.l,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: sizes.sm,
        },
        textContainer: {
            flex: 1,
        },
        header: {
            fontFamily: fonts.h2,
            fontSize: sizes.h3,
            color: '#ffffff',
            textAlign: 'left',
            marginBottom: 3,
            textShadowColor: 'rgba(0,0,0,0.15)',
            textShadowOffset: {width: 0, height: 1},
            textShadowRadius: 2,
        },
        subText: {
            textAlign: 'left',
            fontSize: sizes.smallestText,
            fontFamily: fonts.text,
            color: 'rgba(255,255,255,0.90)',
        },
        arrowContainer: {
            width: sizes.m + 4,
            height: sizes.m + 4,
            borderRadius: (sizes.m + 4) / 2,
            backgroundColor: 'rgba(255,255,255,0.18)',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: sizes.s,
        },
        decorativeCircle: {
            position: 'absolute',
            width: cardWidth * 0.28,
            height: cardWidth * 0.28,
            borderRadius: cardWidth * 0.14,
            backgroundColor: 'rgba(255,255,255,0.06)',
            top: -cardWidth * 0.06,
            right: cardWidth * 0.12,
        },
        decorativeCircleSmall: {
            position: 'absolute',
            width: cardWidth * 0.15,
            height: cardWidth * 0.15,
            borderRadius: cardWidth * 0.075,
            backgroundColor: 'rgba(255,255,255,0.04)',
            bottom: -cardWidth * 0.02,
            left: cardWidth * 0.3,
        },
    });

    return (
        <TouchableOpacity
            id={id}
            style={styles.container}
            onPress={() => onPress()}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
        >
            <Animated.View style={[styles.cardShadow, {transform: [{scale: pressAnim}]}]}>
                <View style={styles.card}>
                    <LinearGradient
                        colors={['#506e88', '#6e7c8a', '#506e88']}
                        start={{x: 0.6, y: 1}}
                        end={{x: 1, y: 2}}
                        style={styles.gradient}
                    >
                        {/* Decorative circles */}
                        <View style={styles.decorativeCircle} />
                        <View style={styles.decorativeCircleSmall} />
                        <View style={{paddingHorizontal:sizes.s,paddingVertical:sizes.sm, flexDirection: 'row', alignItems: 'center', flex: 1}}>
                            <View style={styles.leftContent}>
                                <View style={styles.iconContainer}>
                                    <Icon
                                        name="flash-outline"
                                        size={sizes.h2}
                                        color="#FFFFFF"
                                    />
                                </View>
                                <View style={styles.textContainer}>
                                    <AppText style={styles.header}>{header}</AppText>
                                    <AppText style={styles.subText} numberOfLines={1}>{subText}</AppText>
                                </View>
                            </View>

                            <View style={styles.arrowContainer}>
                                <Icon
                                    name="chevron-forward"
                                    size={sizes.h3}
                                    color="#FFFFFF"
                                />
                            </View>
                        </View>
                    </LinearGradient>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

export default NavigationCard;
