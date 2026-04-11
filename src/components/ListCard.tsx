import React, {useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity, Platform, Animated, Dimensions} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useTheme} from '../hooks';
import {buttonPressInConfig, buttonPressOutConfig, getShortenText} from 'util/commonUtil';
import {AppText} from 'components/index';

const {width} = Dimensions.get('window');

interface IListCard {
    title?: string;
    rightTopText1?: string;
    rightTopText2?: string;
    rightBottomDesc?: string;
    locked?: boolean;
    onPress?: () => void;
}

const ListCard = (props: IListCard) => {
    const {fonts, colors, sizes} = useTheme();
    const {title, rightTopText1, rightTopText2, rightBottomDesc, locked, onPress} = props;
    const [pressAnim] = React.useState(new Animated.Value(1));

    const cardWidth = width * 0.92;

    const handlePressIn = () => {
        Animated.spring(pressAnim, buttonPressInConfig).start();
    };

    const handlePressOut = () => {
        Animated.spring(pressAnim, buttonPressOutConfig).start();
    };

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: {
                    width: cardWidth,
                    marginBottom: sizes.sm,
                },
                cardShadow: {
                    borderRadius: sizes.cardRadius,
                    ...Platform.select({
                        ios: {
                            shadowColor: locked ? '#6B7280' : '#4A6CF7',
                            shadowOffset: {width: 0, height: 4},
                            shadowOpacity: locked ? 0.08 : 0.12,
                            shadowRadius: 10,
                        },
                        android: {
                            elevation: 2,
                        },
                    }),
                },
                card: {
                    flexDirection: 'row',
                    backgroundColor: colors.card,
                    borderRadius: sizes.cardRadius,
                    overflow: 'hidden',
                    alignItems: 'center',
                },
                accentStrip: {
                    width: 7,
                    alignSelf: 'stretch',
                    backgroundColor: colors.cardProgress,
                },
                contentRow: {
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: sizes.sm,
                },
                textSection: {
                    flex: 1,
                    marginRight: sizes.s,
                },
                title: {
                    color: locked ? '#9CA3AF' : colors.text,
                    fontSize: sizes.h4,
                    textAlign: 'left',
                    fontFamily: fonts.medium,
                    lineHeight: sizes.h2,
                    marginTop: sizes.sm,
                },
                descChip: {
                    alignSelf: 'flex-start',
                    marginTop: sizes.sm,
                    marginBottom: sizes.s,
                    paddingHorizontal: sizes.s,
                    paddingVertical: 2.5,
                    borderRadius: sizes.s,
                    backgroundColor: colors.cardTab,
                },
                descText: {
                    fontSize: sizes.smallestText,
                    color: locked ? colors.mediumGray : colors.cardProgress,
                    fontFamily: fonts.medium,
                },
                scoreBadge: {
                    minWidth: sizes.xl,
                    height: sizes.xl,
                    borderRadius: sizes.s,
                    backgroundColor: locked ? '#F3F4F6' : colors.cardTab,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: sizes.s,
                },
                scoreText: {
                    fontFamily: fonts.bold,
                    fontSize: sizes.h4,
                    color: colors.cardProgress,
                },
                scoreSubText: {
                    fontFamily: fonts.medium,
                    fontSize: sizes.smallestText,
                    color: colors.cardProgress,
                },
                percentText: {
                    fontFamily: fonts.medium,
                    fontSize: sizes.text,
                    color: colors.cardProgress,
                },
                percentSymbol: {
                    fontFamily: fonts.semibold,
                    fontSize: sizes.smallestText,
                    color: colors.cardProgress
                },
                lockContainer: {
                    width: sizes.xl,
                    height: sizes.xl,
                    borderRadius: sizes.s,
                    backgroundColor: colors.cardTab,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
            }),
        [colors, locked, cardWidth],
    );

    const renderScoreContent = () =>  {
        if (locked) {
            return (
                <View style={styles.lockContainer}>
                    <MaterialCommunityIcons
                        name="lock"
                        color={colors.mediumGray}
                        size={sizes.h2}
                    />
                </View>
            );
        }

        if (rightTopText1 !== undefined) {
            return (
                <View style={styles.scoreBadge}>
                    <AppText style={styles.scoreText}>{rightTopText1}<AppText
                        style={styles.scoreSubText}>/{rightTopText2}</AppText></AppText>
                </View>
            );
        }

        return (
            <View style={styles.scoreBadge}>
                <AppText style={styles.percentText}>
                    {rightTopText2}
                    <AppText style={styles.percentSymbol}>%</AppText>
                </AppText>
            </View>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.container}
            activeOpacity={1}
            accessibilityRole="button"
            accessibilityLabel={`${title}, ${rightBottomDesc || ''}`}
        >
            <Animated.View style={[styles.cardShadow, {transform: [{scale: pressAnim}]}]}>
                <View style={styles.card}>
                    <View style={styles.accentStrip}/>
                    <View style={styles.contentRow}>
                        <View style={styles.textSection}>
                            <AppText style={styles.title} numberOfLines={1}>
                                {getShortenText(title, 38)}
                            </AppText>
                            {rightBottomDesc && (
                                <View style={styles.descChip}>
                                    <AppText style={styles.descText}>{rightBottomDesc}</AppText>
                                </View>
                            )}
                        </View>
                        {renderScoreContent()}
                    </View>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

export default React.memo(ListCard);
