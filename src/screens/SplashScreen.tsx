import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from 'hooks';
import {Image} from "components";


interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  onAnimationComplete,
}) => {
  const {sizes,fonts, colors} = useTheme();

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.2)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const textSlideAnim = React.useRef(new Animated.Value(40)).current;
  const textOpacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textSlideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 3000);
    });
  }, [fadeAnim, scaleAnim, rotateAnim, textSlideAnim, textOpacityAnim, onAnimationComplete]);

  const rotateZ = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const colorsArrays =
    [  colors.background.toString(),
      colors.background.toString() ,
        colors.background.toString()];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    gradientOrb: {
      position: 'absolute',
      borderRadius: 500,
      backgroundColor: 'rgba(106, 168, 252, 0.15)',
    },
    orb1: {
      width: 350,
      height: 350,
      top: -100,
      right: -80,
    },
    orb2: {
      width: 280,
      height: 280,
      bottom: -120,
      left: -60,
    },
    orb3: {
      width: 200,
      height: 200,
      top: '50%',
      right: '10%',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoWrapper: {
      marginBottom: 120,
    },
    premiumLogo: {
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 15},
      shadowOpacity: 0.35,
      shadowRadius: 25,
      elevation: 15,
    },
    logoEmoji: {
      fontSize: 70,
    },
    ring: {
      position: 'absolute',
      borderWidth: 2,
      borderColor: 'rgba(106, 168, 252, 0.3)',
      borderRadius: 500,
    },
    ring1: {
      width: 160,
      height: 160,
    },
    ring2: {
      width: 200,
      height: 200,
    },
    textSection: {
      alignItems: 'center',
      marginBottom: 80,
    },
    premiumTitle: {
      fontSize: 25,
      color:colors.gray,
      fontFamily:fonts.semibold,
      fontWeight: '800',
      letterSpacing: 1.2,
      marginTop: 50,
    },
    divider: {
      height: 1.5,
      width: 100,
      marginVertical: 50,
    },
    premiumSubtitle: {
      color:colors.text,
      fontSize: 16,
      fontFamily:fonts.text,
      letterSpacing: 0.8,
    },
    statusContainer: {
      position: 'absolute',
      bottom: 60,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
  });

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <LinearGradient
        colors={colorsArrays}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFill}>
        {/* Premium background elements */}
        <Animated.View
          style={[
            styles.gradientOrb,
            styles.orb1,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.12],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.gradientOrb,
            styles.orb2,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.08],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.gradientOrb,
            styles.orb3,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.1],
              }),
            },
          ]}
        />
      </LinearGradient>

      <View style={styles.content}>
        {/* Premium animated logo */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: fadeAnim,
              transform: [
                {scale: scaleAnim},
                {rotateZ: rotateZ},
              ],
            },
          ]}>
          <View style={[styles.premiumLogo, {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
          }]}>
            <View style={[{
              width: sizes.base * 18,
              height: sizes.base * 18,
              borderRadius: sizes.xxl,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: '#cecece',
            }, {backgroundColor: 'rgba(255, 255, 255, 0.15)'}]}>
              <Image
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode:'cover'
                }}
                source={require('../assets/images/lifeintheukapp-logo.png')}
              />
            </View>
            {/* Floating rings */}
          </View>
        </Animated.View>

        {/* Premium text content */}
        <Animated.View
          style={[
            styles.textSection,
            {
              opacity: textOpacityAnim,
              transform: [{translateY: textSlideAnim}],
            },
          ]}>
          <Text style={[styles.premiumTitle]}>
            Life in the UK Test 2026
          </Text>
          <View style={[styles.divider, {backgroundColor: 'rgba(255, 255, 255, 0.4)'}]} />
          <Text style={[styles.premiumSubtitle, {color: 'rgba(255, 255, 255, 0.8)'}]}>
            QuizMarkt
          </Text>
        </Animated.View>

        {/* Animated status indicators */}
        <Animated.View
          style={[
            styles.statusContainer,
            {
              opacity: textOpacityAnim,
              transform: [{translateY: textSlideAnim.interpolate({
                inputRange: [0, 40],
                outputRange: [0, 40],
              })}],
            },
          ]}>
          <StatusDot />
          <Text style={[{fontFamily:fonts.text}, {color:'rgba(255, 255, 255, 0.7)'}]}>
            Initializing...
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const StatusDot: React.FC<{}> = ({}) => {
  const pulseAnim = React.useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        { width: 10,
          height: 10,
          borderRadius: 5,},
        {
          backgroundColor:'#4FC3F7',
          opacity: pulseAnim.interpolate({
            inputRange: [0.5, 1],
            outputRange: [0.6, 1],
          }),
          transform: [
            {
              scale: pulseAnim.interpolate({
                inputRange: [0.5, 1],
                outputRange: [1, 1.2],
              }),
            },
          ],
        },
      ]}
    />
  );
};

export default SplashScreen;

