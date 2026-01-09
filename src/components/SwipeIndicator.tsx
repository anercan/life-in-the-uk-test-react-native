import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {useTheme} from "hooks";
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
        imageWrapper: {
            alignItems: 'center',
        },
    });
    const translateX = useRef(new Animated.Value(250)).current;
    const fadeIn = useRef(new Animated.Value(0)).current;
    const scaleArrow = useRef(new Animated.Value(0.8)).current;
    const heartbeat = useRef(new Animated.Value(1)).current;

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
            Animated.spring(scaleArrow, {
                toValue: 1,
                friction: 5,
                tension: 70,
                delay,
                useNativeDriver: true,
            }),
        ]).start();

        // Heartbeat animation loop
        Animated.loop(
            Animated.sequence([
                // First beat
                Animated.timing(heartbeat, {
                    toValue: 1.2,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(heartbeat, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
                // Second beat
                Animated.timing(heartbeat, {
                    toValue: 1.2,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(heartbeat, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
                // Pause
                Animated.delay(600),
            ])
        ).start();
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
                fontFamily: fonts.semibold,
                fontSize: sizes.smallText,
                color: colors.primary,
                marginBottom: sizes.s,
                textAlign: 'center',
                letterSpacing: 0.5,
            }}>
                {message}
            </AppText>
            <View style={styles.imageWrapper}>
                <Animated.Image
                    style={{
                        width: sizes.xxl,
                        height: sizes.xxl,
                        tintColor: colors.primary,
                        transform: [
                            {scale: scaleArrow},
                            {scale: heartbeat}
                        ],
                    }}
                    source={require('../assets/images/swipe.png')}
                />
            </View>
        </Animated.View>
    );
};

export default SwipeIndicator;
