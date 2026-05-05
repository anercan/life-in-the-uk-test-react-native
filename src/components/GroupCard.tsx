import React from 'react';
import {View, StyleSheet, TouchableOpacity, ImageProps, Dimensions, Animated, Platform} from 'react-native';
import {useTheme} from "../hooks";
import {AppText} from "components/index";
import LinearGradient from 'react-native-linear-gradient';
import {buttonPressInConfig, buttonPressOutConfig} from "util/commonUtil";

interface IGroupCard {
    card: any,
    onPress?: () => void;
    backgroundColor: string
    backgroundImage?: ImageProps
}

const {width} = Dimensions.get('window');

const GroupCard = (props: IGroupCard) => {

    const {fonts, sizes} = useTheme();
    const [pressAnim] = React.useState(new Animated.Value(1));

    const cardWidth = width / 2.25;
    const cardHeight = width * 0.42;

    const handlePressIn = () => {
        Animated.spring(pressAnim, buttonPressInConfig).start();
    };

    const handlePressOut = () => {
        Animated.spring(pressAnim, buttonPressOutConfig).start();
    };

    function getProgress() {
        if (!props.card?.quizQuantity) return 0;
        return Math.round((props.card?.userSolvedCount / props.card?.quizQuantity) * 100);
    }

    const progressPercent = getProgress();
    const isCompleted = progressPercent === 100;

    const lightenColor = (hex: string, amount: number): string => {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, (num >> 16) + amount);
        const g = Math.min(255, ((num >> 8) & 0x00FF) + amount);
        const b = Math.min(255, (num & 0x0000FF) + amount);
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    };

    const darkenColor = (hex: string, amount: number): string => {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.max(0, (num >> 16) - amount);
        const g = Math.max(0, ((num >> 8) & 0x00FF) - amount);
        const b = Math.max(0, (num & 0x0000FF) - amount);
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    };

    const bgColor = props.backgroundColor;
    const gradientStart = lightenColor(bgColor, 25);
    const gradientEnd = darkenColor(bgColor, 30);

    const styles = StyleSheet.create({
        container: {
            marginHorizontal: sizes.s,
            marginVertical: sizes.s * 0.8,
        },
        cardShadow: {
            borderRadius: sizes.cardRadius,
            ...Platform.select({
                ios: {
                    shadowColor: darkenColor(bgColor, 60),
                    shadowOffset: {width: 0, height: 6},
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                },
                android: {
                    elevation: 3,
                },
            }),
        },
        card: {
            width: cardWidth,
            height: cardHeight,
            borderRadius: sizes.cardRadius,
            overflow: 'hidden',
        },
        gradient: {
            flex: 1,
            justifyContent: 'space-between',
        },
        topRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
        iconContainer: {
            width: sizes.md + 4,
            height: sizes.md + 4,
            borderRadius: (sizes.md + 4) / 2,
            backgroundColor: 'rgba(255,255,255,0.1)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        statusBadge: {
            paddingHorizontal: sizes.s * 1.2,
            paddingVertical: 3,
            borderRadius: sizes.s * 2,
            backgroundColor: isCompleted ? 'rgba(6,194,63,0.35)' : 'rgba(255,255,255,0.18)',
        },
        statusText: {
            fontFamily: fonts.semibold,
            fontSize: sizes.smallestText - 1,
            color: '#FFFFFF',
            letterSpacing: 0.3,
        },
        titleSection: {
            justifyContent: 'center',
            marginTop: sizes.m,
        },
        cardTitle: {
            fontFamily: fonts.text,
            fontSize: sizes.h2,
            color: '#FFFFFF',
            //lineHeight: sizes.sm,
            //textAlign: 'left',
            textShadowColor: 'rgba(0,0,0,0.15)',
            textShadowOffset: {width: 0, height: 1},
            textShadowRadius: 2,
        },
        bottomSection: {
            marginTop: sizes.l,
        },
        progressRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: sizes.s,
        },
        progressLabelText: {
            fontFamily: fonts.semibold,
            fontSize: sizes.smallestText,
            color: 'rgba(255,255,255,0.85)',
        },
        progressPercentText: {
            fontFamily: fonts.bold,
            fontSize: sizes.smallestText,
            color: '#FFFFFF',
        },
        progressBarContainer: {
            width: '100%',
            height: 5,
            borderRadius: 3,
            backgroundColor: 'rgba(255,255,255,0.2)',
            overflow: 'hidden',
        },
        progressBarFill: {
            height: '100%',
            borderRadius: 3,
            backgroundColor: '#FFFFFF',
        },
        decorativeCircle: {
            position: 'absolute',
            width: cardWidth * 0.55,
            height: cardWidth * 0.55,
            borderRadius: cardWidth * 0.275,
            backgroundColor: 'rgba(255,255,255,0.06)',
            top: -cardWidth * 0.12,
            right: -cardWidth * 0.15,
        },
        decorativeCircleSmall: {
            position: 'absolute',
            width: cardWidth * 0.3,
            height: cardWidth * 0.3,
            borderRadius: cardWidth * 0.15,
            backgroundColor: 'rgba(255,255,255,0.04)',
            bottom: cardWidth * 0.25,
            left: -cardWidth * 0.08,
        },
    });

    const titleText = props.card?.title || '';

    return (
        <TouchableOpacity
            id={`card-${props?.card?.id}`}
            style={styles.container}
            onPress={props.onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
        >
            <Animated.View style={[styles.cardShadow, {transform: [{scale: pressAnim}]}]}>
                <View style={styles.card}>
                    <LinearGradient
                        colors={[gradientStart, bgColor, gradientEnd]}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={styles.gradient}
                    >
                        {/* Decorative circles */}
                        <View style={styles.decorativeCircle}/>
                        <View style={styles.decorativeCircleSmall}/>

                        <View style={{padding: sizes.s}}>
                            {/* Top row: status */}
                            <View style={styles.topRow}>
                                <View style={styles.iconContainer}>
                                </View>
                                <View style={styles.statusBadge}>
                                    <AppText style={styles.statusText}>
                                        {isCompleted ? '✓ Done' : `${props.card?.userSolvedCount || 0}/${props.card?.quizQuantity || 0}`}
                                    </AppText>
                                </View>
                            </View>

                            {/* Title */}
                            <View style={styles.titleSection}>
                                <AppText adjustsFontSizeToFit
                                         numberOfLines={1}
                                         minimumFontScale={0.5} style={styles.cardTitle}>
                                    {titleText}
                                </AppText>
                            </View>

                            {/* Progress bar */}
                            <View style={styles.bottomSection}>
                                <View style={styles.progressRow}>
                                    <AppText style={styles.progressLabelText}>
                                        Progress
                                    </AppText>
                                    <AppText style={styles.progressPercentText}>
                                        {progressPercent}%
                                    </AppText>
                                </View>
                                <View style={styles.progressBarContainer}>
                                    <View
                                        style={[styles.progressBarFill, {width: `${Math.max(progressPercent, 2)}%`}]}/>
                                </View>
                            </View>
                        </View>

                    </LinearGradient>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

export default React.memo(GroupCard);
