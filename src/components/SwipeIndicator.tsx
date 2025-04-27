import React, { useEffect, useRef } from 'react';
import {Animated, StyleSheet, Text} from 'react-native';
import {useTheme} from "hooks";
import Image from "components/Image";

const SwipeIndicator = () => {
  const translateX = useRef(new Animated.Value(250)).current; // Start from 500px to the right (off-screen)
  const fadeIn = useRef(new Animated.Value(0)).current; // Initial opacity 0 (hidden)
  const {sizes,colors,fonts} = useTheme();

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop:sizes.s,
      marginBottom: -sizes.sm
    },
    image: {
      width: 75, // Adjust size as needed
      height: 75,
    },
  });

  useEffect(() => {
    // Animate the image: fade in and swipe from right to left
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0, // Move to the center (from right to left)
        duration: 1250, // Swipe duration
        useNativeDriver: true, // Use native driver for better performance
      }),
      Animated.timing(fadeIn, {
        toValue: 1, // Fade in to full opacity
        duration: 1000, // Fade duration
        delay: 500, // Delay before starting fade
        useNativeDriver: true, // Use native driver for better performance
      })
    ]).start();
  }, []);

  return (
      <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeIn,
              transform: [{ translateX }],
            },
          ]}
      >
        <Text style={{
          textAlign: 'center',
          fontFamily: fonts.p,
          fontSize: sizes.smallText,
          color: colors.text
        }}>Swipe Or Tap!</Text>
        <Image
            width={sizes.xxl}
            height={sizes.xxl}
            color={colors.text}
            source={require('../assets/images/swipe.png')}
        />
      </Animated.View>
  );
};

export default SwipeIndicator;
