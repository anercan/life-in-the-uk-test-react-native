import React from 'react';
import {View, StyleSheet, TouchableOpacity, ImageProps, Dimensions, Animated} from 'react-native';
import {useTheme} from "../hooks";
import {AppText} from "components/index";
import * as Progress from 'react-native-progress';

interface IGroupCard {
    card: any,
    onPress?: () => void;
    backgroundColor: string
    backgroundImage: ImageProps
}

const {width} = Dimensions.get('window');

const GroupCard = (props: IGroupCard) => {

    const {fonts, sizes, colors} = useTheme();
    const [pressAnim] = React.useState(new Animated.Value(1));

    const cardWidth = width / 2.4;

    const handlePressIn = () => {
        Animated.spring(pressAnim, {
            toValue: 0.9,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(pressAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const styles = StyleSheet.create({
        container: {
            margin: sizes.xs,
            marginHorizontal: sizes.s,
            marginVertical: sizes.s,
        },
        card: {
            elevation: 2,
            justifyContent: 'space-between',
            width: cardWidth,
            height: cardWidth / 1.1,
            backgroundColor: props.backgroundColor,
            borderRadius: sizes.md,
            overflow: 'hidden',
        },
        cardTextSection: {
            marginTop: sizes.m,
        },
        progressSection: {
            backgroundColor: 'rgba(62,63,64,0.5)',
            width: '100%',
            height: cardWidth / 3.5,
            alignItems: 'center',
            justifyContent: 'center',
        },
        cardText: {
            fontFamily: fonts.text,
            fontSize: sizes.h2,
            color: colors.gray,
            lineHeight: sizes.m,
            minHeight: sizes.m * 3,
        },
        progressBar: {
            width: '75%',
        },
        progressLabel: {
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'center',
        },
        percentageText: {
            marginTop: sizes.xs,
            color: colors.gray,
            fontSize: sizes.h4,
            fontFamily: fonts.h2,
            fontWeight: 'bold',
        },
        percentageSymbol: {
            color: colors.gray,
            fontSize: sizes.h5,
            fontFamily: fonts.text,
            marginLeft: 2,
        }
    });

    function getProgress() {
        return Math.round((props.card?.userSolvedCount / props.card?.quizQuantity) * 100);
    }

    const progressValue = getProgress() / 100;

    let titleText = props.card?.title
        ?.replace(/(?<!\bof|is)\s/g, '\n');

    if (titleText && !titleText.includes('\n')) {
        titleText = `\n${titleText}\n`;
    }

    return (
        <TouchableOpacity
            id={`card-${props?.card?.id}`}
            style={styles.container}
            onPress={props.onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
        >
            <Animated.View style={[{transform: [{scale: pressAnim}]}]}>
                <View style={styles.card}>
                    <View>
                        <View style={styles.cardTextSection}>
                            <AppText
                                style={styles.cardText}
                                numberOfLines={3}
                            >
                                {titleText}
                            </AppText>
                        </View>
                    </View>

                    {/* Progress Section */}
                    <View style={styles.progressSection}>
                        <View style={styles.progressBar}>
                            <Progress.Bar
                                progress={progressValue}
                                width={null}
                                height={4}
                                color={colors.text as string}
                                unfilledColor={colors.cardBorder as string}
                                borderWidth={0}
                                borderRadius={2}
                            />
                        </View>

                        <View style={styles.progressLabel}>
                            <AppText style={styles.percentageText}>
                                {props.card?.userSolvedCount}
                            </AppText>
                            <AppText style={styles.percentageSymbol}>/{props.card?.quizQuantity}
                            </AppText>
                        </View>
                    </View>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

export default React.memo(GroupCard);
