import React, {useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useTheme} from '../hooks';
import {getShortenText} from 'util/commonUtil';
import {AppText} from 'components/index';

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

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: {
                    width: '90%',
                    marginBottom: sizes.sm,
                },
                card: {
                    flexDirection: 'row',
                    backgroundColor: colors.card,
                    borderRadius: sizes.sm,
                    borderLeftWidth: sizes.s,
                    borderColor: locked ? colors.light : colors.primary,
                    borderWidth: 0.5,
                    overflow: 'hidden',
                    ...Platform.select({
                        ios: {
                            shadowColor: colors.shadow,
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                        },
                        android: {
                            elevation: 2,
                        },
                    }),
                },
                iconBox: {
                    width: 70,
                    height: 70,
                    margin: sizes.s,
                    marginRight: sizes.sm,
                    borderRadius: sizes.s,
                    backgroundColor: locked ? colors.mediumGray : colors.orderBoxBackGround,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                contentBox: {
                    flex: 1,
                    paddingVertical: sizes.s,
                    paddingRight: sizes.sm,
                    justifyContent: 'space-between',
                },
                titleContainer: {
                    flex: 1,
                    justifyContent: 'center',
                },
                title: {
                    color: locked ? colors.light : colors.text,
                    fontSize: sizes.h3,
                    textAlign: 'left',
                    fontFamily: fonts.semibold,
                    lineHeight: sizes.h3 * 1.3,
                },
                descContainer: {
                    marginTop: sizes.xs,
                },
                descText: {
                    fontSize: sizes.h5,
                    textAlign: 'left',
                    color: locked ? colors.light : colors.secondary,
                    fontFamily: fonts.medium,
                },
                topText: {
                    fontFamily: fonts.bold,
                    fontSize: sizes.h2,
                    color: colors.text,
                },
                topTextSecondary: {
                    fontFamily: fonts.semibold,
                    fontSize: sizes.h4,
                    color: colors.text,
                },
                percentageText: {
                    fontFamily: fonts.bold,
                    fontSize: sizes.h1,
                    color: colors.text,
                },
                percentageSymbol: {
                    fontFamily: fonts.semibold,
                    fontSize: sizes.h4,
                    color: colors.text,
                },
            }),
        [colors, locked]
    );

    const renderIconContent = useMemo(() => {
        if (locked) {
            return (
                <MaterialCommunityIcons
                    name="lock"
                    color={colors.light}
                    size={sizes.l}
                />
            );
        }

        if (rightTopText1 !== undefined) {
            return (
                <AppText style={styles.topText}>
                    {rightTopText1}
                    <AppText style={styles.topTextSecondary}>/{rightTopText2}</AppText>
                </AppText>
            );
        }

        return (
            <AppText style={styles.percentageText}>
                {rightTopText2}
                <AppText style={styles.percentageSymbol}>%</AppText>
            </AppText>
        );
    }, [locked, rightTopText1, rightTopText2, colors]);

    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}
            activeOpacity={0.7}
            disabled={locked}
            accessibilityRole="button"
            accessibilityLabel={`${title}, ${rightBottomDesc || ''}`}
            accessibilityState={{disabled: locked}}
        >
            <View style={styles.card}>
                <View style={styles.iconBox}>{renderIconContent}</View>
                <View style={styles.contentBox}>
                    <View style={styles.titleContainer}>
                        <AppText style={styles.title} numberOfLines={2}>
                            {getShortenText(title, 35)}
                        </AppText>
                    </View>
                    {rightBottomDesc && (
                        <View style={styles.descContainer}>
                            <AppText style={styles.descText}>{rightBottomDesc}</AppText>
                        </View>
                    )}
                </View>
            </View>

        </TouchableOpacity>
    );
};

export default React.memo(ListCard);
