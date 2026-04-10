import React from 'react';
import {View, StyleSheet, TouchableOpacity, ActivityIndicator, Platform} from 'react-native';
import {ProductSubscription, SubscriptionOffer, useIAP} from 'react-native-iap';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppText} from 'components/index';
import {getItemOfferText, isFreeTrialEligible} from 'util/subscriptionUtils';
import useTheme from '../hooks/useTheme';

interface SubscriptionItemProps {
    subscription: ProductSubscription;
    isSelected: boolean;
    isPurchasing: boolean;
    onSelect: () => void;
    onPurchase: (subscriptionId: string, offerTokenAndroid?: string | null) => void;
}

const SubscriptionItem = ({
                              subscription,
                              isSelected,
                              isPurchasing,
                              onSelect,
                              onPurchase,
                          }: SubscriptionItemProps) => {
    const {requestPurchase} = useIAP();
    const {fonts, sizes, colors} = useTheme();

    const primaryOffer: SubscriptionOffer | undefined = subscription.subscriptionOffers?.[0];

    const handleSubscribe = () => {
        onPurchase(subscription.id, primaryOffer?.offerTokenAndroid);

        if (Platform.OS === 'android' && primaryOffer?.offerTokenAndroid) {
            requestPurchase({
                request: {
                    google: {
                        skus: [subscription.id],
                        subscriptionOffers: [
                            {
                                sku: subscription.id,
                                offerToken: primaryOffer.offerTokenAndroid,
                            },
                        ],
                    },
                },
                type: 'subs',
            });
        } else if (Platform.OS === 'ios') {
            requestPurchase({
                request: {
                    apple: {
                        sku: subscription.id,
                    },
                },
                type: 'subs',
            });
        }
    };

    const getPriceText = () => {
        if (primaryOffer?.displayPrice) {
            if (primaryOffer.pricingPhasesAndroid?.pricingPhaseList) {
                return primaryOffer.pricingPhasesAndroid.pricingPhaseList
                    .map((phase) =>
                        getItemOfferText(
                            phase.billingPeriod,
                            phase.formattedPrice,
                            phase.priceAmountMicros,
                        ),
                    )
                    .join(' then ');
            }
            return primaryOffer.displayPrice;
        }
        return subscription.title || 'Premium';
    };

    const styles = StyleSheet.create({
        container: {
            marginVertical: sizes.xs,
        },
        card: {
            borderRadius: 16,
            borderWidth: isSelected ? 2 : 1,
            borderColor: isSelected ? '#FFD700' : 'rgba(255,255,255,0.2)',
            backgroundColor: isSelected
                ? 'rgba(255,215,0,0.08)'
                : 'rgba(255,255,255,0.06)',
            overflow: 'hidden',
        },
        cardContent: {
            padding: sizes.sm,
        },
        topRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: sizes.s,
        },
        titleRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        planTitle: {
            fontSize: sizes.h3,
            fontFamily: fonts.medium,
            color: colors.gray,
            marginLeft: sizes.xs,
        },
        trialBadge: {
            backgroundColor: '#FFD700',
            marginRight: sizes.m,
            borderRadius: 10,
            paddingHorizontal: 0,
            paddingVertical: 3,
        },
        trialBadgeText: {
            fontSize: sizes.smallestText,
            fontFamily: fonts.bold,
            color: '#1a1a2e',
        },
        priceText: {
            fontSize: sizes.smallText,
            fontFamily: fonts.medium,
            color: 'rgba(255,255,255,0.85)',
            marginBottom: sizes.sm,
            textAlign: 'left',
        },
        buttonWrapper: {
            borderRadius: 12,
            overflow: 'hidden',
        },
        gradient: {
            paddingVertical: 14,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
        },
        buttonText: {
            fontSize: sizes.smallText,
            fontFamily: fonts.medium,
            color: '#1a1a2e',
            marginLeft: sizes.xs,
        },
        disabledOverlay: {
            opacity: 0.6,
        },
        checkIcon: {
            position: 'absolute',
            top: sizes.sm,
            right: sizes.sm,
        },
    });

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onSelect}
            style={styles.container}>
            <View style={styles.card}>
                <View style={styles.cardContent}>
                    {/* Top row: title + trial badge */}
                    <View style={styles.topRow}>
                        <View style={styles.titleRow}>
                            <Icon
                                name={isSelected ? 'radiobox-marked' : 'radiobox-blank'}
                                size={22}
                                color={isSelected ? '#c7cdd5' : 'rgba(255,255,255,0.4)'}
                            />
                            <AppText style={styles.planTitle}>
                                {subscription.displayName || 'Premium+'}
                            </AppText>
                        </View>
                    </View>

                    {/* Price breakdown */}
                    <AppText style={styles.priceText}>{getPriceText()}</AppText>

                    {/* Subscribe Button */}
                    <TouchableOpacity
                        activeOpacity={0.85}
                        disabled={!isSelected || isPurchasing}
                        onPress={handleSubscribe}
                        style={[
                            styles.buttonWrapper,
                            (!isSelected || isPurchasing) && styles.disabledOverlay,
                        ]}>
                        <LinearGradient
                            colors={isSelected ? ['#FFD700', '#f5a623'] : ['#888', '#666']}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                            style={styles.gradient}>
                            {isPurchasing ? (
                                <ActivityIndicator size="small" color="#1a1a2e"/>
                            ) : (
                                <>
                                    <Icon name="lightning-bolt" size={20} color="#1a1a2e"/>
                                    <AppText style={styles.buttonText}>
                                        {isFreeTrialEligible(primaryOffer) ? 'Start Free Trial!' : 'Subscribe Now!'}
                                    </AppText>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default SubscriptionItem;
