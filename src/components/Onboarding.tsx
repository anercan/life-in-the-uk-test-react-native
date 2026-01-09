import React, {useContext, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Platform, ColorValue} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import Image from 'components/Image';
import {AppText} from 'components/index';
import {useTheme} from 'hooks';
import {TitleContext} from 'context/TitleContext';

interface IAppOnboarding {
    onDone: () => void;
}

interface OnboardingPage {
    backgroundColor: ColorValue;
    image: React.ReactElement;
    title: string;
    subtitle: string;
}

const AppOnboarding: React.FC<IAppOnboarding> = ({onDone}) => {
    const {setTitle} = useContext(TitleContext);
    const {colors, fonts, sizes} = useTheme();

    useEffect(() => {
        setTitle('');
    }, [setTitle]);

    const styles = StyleSheet.create({
        dotStyle: {
            width: sizes.s,
            height: sizes.s,
            borderRadius: sizes.s / 2,
            marginHorizontal: sizes.xs,
            backgroundColor: colors.white,
            opacity: 0.4,
        },
        selectedDotStyle: {
            width: sizes.sm,
            height: sizes.s,
            borderRadius: sizes.s / 2,
            marginHorizontal: sizes.xs,
            backgroundColor: colors.white,
        },
        buttonContainer: {
            paddingHorizontal: sizes.sm,
            paddingVertical: sizes.s,
            marginHorizontal: sizes.sm,
            borderRadius: sizes.buttonRadius,
            minWidth: 100,
            alignItems: 'center',
            justifyContent: 'center',
            ...Platform.select({
                ios: {
                    shadowColor: colors.shadow,
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.15,
                    shadowRadius: 3,
                },
                android: {
                    elevation: 2,
                },
            }),
        },
        skipButton: {
            borderWidth: 1,
            backgroundColor: colors.primary,
            borderColor: colors.white,
        },
        nextButton: {
            backgroundColor: colors.white,
        },
        doneButton: {
            backgroundColor: colors.white,
        },
        skipButtonText: {
            fontFamily: fonts.semibold,
            fontSize: sizes.h4,
            color: colors.white,
        },
        nextButtonText: {
            fontFamily: fonts.bold,
            fontSize: sizes.h4,
            color: colors.primary,
        },
        doneButtonText: {
            fontFamily: fonts.bold,
            fontSize: sizes.h4,
            color: colors.primary,
        },
        labelContainer: {
            marginBottom: sizes.xl,
            paddingBottom: sizes.md,
        },
        titleStyle: {
            fontFamily: fonts.bold,
            fontSize: sizes.h1,
            color: colors.white,
            marginBottom: sizes.s,
        },
        subtitleStyle: {
            fontFamily: fonts.medium,
            fontSize: sizes.h4,
            color: colors.white,
            paddingHorizontal: sizes.md,
            textAlign: 'center',
            lineHeight: sizes.h4 * 1.5,
        },
        imageContainer: {
            marginBottom: sizes.sm,
        },
        bottomBarContainer: {
            paddingBottom: sizes.xl,
            paddingTop: sizes.md,
        },
    });

    const renderSkipButton = ({...props}) => (
        <TouchableOpacity
            {...props}
            style={[styles.buttonContainer, styles.skipButton]}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
        >
            <AppText style={styles.skipButtonText}>Skip</AppText>
        </TouchableOpacity>
    );

    const renderNextButton = ({...props}) => (
        <TouchableOpacity
            {...props}
            style={[styles.buttonContainer, styles.nextButton]}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Next page"
        >
            <AppText style={styles.nextButtonText}>Next</AppText>
        </TouchableOpacity>
    );

    const renderDoneButton = ({...props}) => (
        <TouchableOpacity
            {...props}
            style={[styles.buttonContainer, styles.doneButton]}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Finish onboarding"
        >
            <AppText style={styles.doneButtonText}>Start!</AppText>
        </TouchableOpacity>
    );

    const renderDot = ({selected}: {selected: boolean}) => (
        <View
            style={selected ? styles.selectedDotStyle : styles.dotStyle}
            accessibilityRole="none"
        />
    );

    const pages: OnboardingPage[] = [
        {
            backgroundColor: colors.background,
            image: (
                <View style={styles.imageContainer}>
                    <Image
                        resizeMode="contain"
                        style={{width: 300, height: 250}}
                        source={require('/assets/images/onboard/solve.png')}
                    />
                </View>
            ),
            title: 'Solve!',
            subtitle: 'Start solving official questions and improve your knowledge',
        },
        {
            backgroundColor: colors.background,
            image: (
                <View style={styles.imageContainer}>
                    <Image
                        resizeMode="contain"
                        style={{width: 300, height: 250}}
                        source={require('/assets/images/onboard/compare.png')}
                    />
                </View>
            ),
            title: 'Compare!',
            subtitle: 'Compare your results with others and see how you rank',
        },
        {
            backgroundColor: colors.background,
            image: (
                <View style={styles.imageContainer}>
                    <Image
                        resizeMode="contain"
                        style={{width: 300, height: 250}}
                        source={require('/assets/images/onboard/analize.png')}
                    />
                </View>
            ),
            title: 'Recognize Shortcomings!',
            subtitle:
                'Check the topics where you\'ve made the most mistakes under your profile',
        },
    ];

    return (
        <Onboarding
            pages={pages}
            onDone={onDone}
            onSkip={onDone}
            SkipButtonComponent={renderSkipButton}
            NextButtonComponent={renderNextButton}
            DoneButtonComponent={renderDoneButton}
            DotComponent={renderDot}
            containerStyles={styles.labelContainer}
            titleStyles={styles.titleStyle}
            subTitleStyles={styles.subtitleStyle}
            imageContainerStyles={styles.imageContainer}
            bottomBarContainerStyles={styles.bottomBarContainer}
            bottomBarHeight={100}
            bottomBarHighlight={false}
            transitionAnimationDuration={300}
        />
    );
};

export default AppOnboarding;
