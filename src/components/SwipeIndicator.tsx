import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {useTheme} from "hooks";
import Image from "components/Image";
import {AppText} from "components/index";

interface SwipeIndicatorProps {
    message?: string;
    delay?: number;
    duration?: number;
}

const SwipeIndicator: React.FC<SwipeIndicatorProps> = ({
                                                           message = "Swipe or Tap the Card!",
                                                           delay = 300,
                                                           duration = 1500,
                                                       }) => {
    const {sizes, colors, fonts} = useTheme();

    const styles = StyleSheet.create({
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: sizes.s,
            marginBottom: -sizes.sm,
        },
        imageWrapper: {},
    });
    const translateX = useRef(new Animated.Value(250)).current;
    const fadeIn = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(translateX, {
                toValue: 0,
                friction: 6,
                tension: 80,
                useNativeDriver: true,
            }),
            Animated.timing(fadeIn, {
                toValue: 1,
                duration,
                delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeIn,
                    transform: [{translateX}],
                },
            ]}
        >
            <AppText style={{
                fontFamily: fonts.text,
                fontSize: sizes.smallText,
                color: colors.primary,
                marginBottom: sizes.xs,
                textAlign: 'center'
            }}>
                {message}
            </AppText>
            <View style={styles.imageWrapper}>
                <Image
                    width={sizes.xxl}
                    height={sizes.xxl}
                    color={colors.background}
                    source={require('../assets/images/swipe.png')}
                />
            </View>
        </Animated.View>
    );
};

export default SwipeIndicator;
