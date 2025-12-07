import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
    FadeInDown,
    FadeInUp,
    ZoomIn,
} from 'react-native-reanimated';
import useTheme from "../hooks/useTheme";
import {TitleContext} from "context/TitleContext";
import {
    finishTransaction,
    flushFailedPurchasesCachedAsPendingAndroid,
    getSubscriptions,
    initConnection, ProductPurchase, Purchase, PurchaseError,
    purchaseErrorListener,
    purchaseUpdatedListener,
    requestSubscription, SubscriptionPurchase
} from 'react-native-iap';
import {AuthContext} from "context/AuthContext";
import {getUserId} from "util/jwtUtil";
import {getItemOfferText, isAndroid, isFreeTrialEligible} from "util/commonUtil";
import {logEvent} from "util/logUtil";
import {AppText} from "components";
import {useUserManagementService} from "services/UserManagementService";

let monthlySubProductId = 'level1';

const benefits = [
    'Access Premium+ Quizzes',
    'Limitless Personal Daily Challenges',
    'Create Favorite Questions List',
    'Advanced Statistics & Analytics',
    'Compare Results with Others',
    'Cancellation Available Anytime!'
];

const PremiumScreen = ({navigation}) => {
    const {googleSubscribe} = useUserManagementService(navigation);
    const {fonts, sizes, colors} = useTheme();
    const {login} = useContext(AuthContext);
    const {setTitle} = useContext(TitleContext);
    const [product, setProduct] = useState<any>();
    const [buttonDisable, setButtonDisable] = useState<boolean>(true);
    let purchaseErrorSubscription;
    let purchaseUpdateSubscription: any = null;

    useEffect(() => {
        init();
        setTitle('');
        return () => {
            purchaseUpdateSubscription?.remove();
            purchaseErrorSubscription?.remove();
        };
    }, []);

    const init = async () => {
        initConnection().then(() => {
            getSubscriptions({'skus': [monthlySubProductId]})
                .then((r: any) => {
                    setButtonDisable(false);
                    setProduct(r[0]);
                    //console.log(JSON.stringify(r[0]))
                })
                .catch(() => setButtonDisable(true));

            flushFailedPurchasesCachedAsPendingAndroid().then(() => subscriptionListener());
        });
    }

    const logSubscription = () => {
        try {
            getUserId().then(userId => logEvent('subscription', {userId: userId}));
        } catch (e) {
            logEvent('analyticError');
        }
    }

    const consumeGooglePlayDeliveryResult = async (purchaseResult: Purchase, serviceResult: any) => {
        if (serviceResult) {
            login(serviceResult.jwt);
            await finishTransaction({purchase: purchaseResult, isConsumable: false})
            navigation.navigate('SettingsScreen');
            logSubscription();
        } else {
            setButtonDisable(false);
        }
    }

    const logBackendError = (e) => {
        getUserId().then(userId => logEvent('error_purchase_backend', {userId: userId, error: e}));
    }

    const subscriptionListener = () => {
        purchaseUpdateSubscription = purchaseUpdatedListener((purchase: SubscriptionPurchase | ProductPurchase) => {
                const receipt = purchase?.transactionReceipt;
                if (receipt) {
                    if (isAndroid()) {
                        googleSubscribe(purchase)
                            .then(async (deliveryResult) => {
                                await consumeGooglePlayDeliveryResult(purchase, deliveryResult);
                            })
                            .catch(e => logBackendError(e));
                    }
                }
            },
        );

        purchaseErrorSubscription = purchaseErrorListener(
            (error: PurchaseError) => {
                getUserId().then(userId => {
                    logEvent('error_purchase', {
                        userId: userId,
                        errorName: error?.name,
                        errorMessage: error?.message,
                        errorCode: error?.code
                    });
                });
                setButtonDisable(false)
            },
        );
    }

    const getOfferText = () => {
        if (product) {
            return product && isFreeTrialEligible(product) ? getProductOffer(0) + ' then ' + getProductOffer(1) : getProductOffer(0);
        }
        return '';
    }

    const handleUpgrade = () => {
        setButtonDisable(true);
        let request = {
            subscriptionOffers: [
                {
                    sku: product?.productId,
                    offerToken: product?.subscriptionOfferDetails[0]?.offerToken,
                },
            ],
        };
        requestSubscription(request)
    }

    const getProductOffer = (item) => {
        return getItemOfferText(product?.subscriptionOfferDetails[item]?.pricingPhases.pricingPhaseList[0]?.billingPeriod, product?.subscriptionOfferDetails[item]?.pricingPhases.pricingPhaseList[0]?.formattedPrice, product?.subscriptionOfferDetails[item]?.pricingPhases.pricingPhaseList[0]?.priceAmountMicros);
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: sizes.m,
            justifyContent: 'space-between',
        },
        header: {
            alignItems: 'center',
            marginTop: sizes.xs,
        },
        title: {
            textAlign: 'auto',
            fontSize: 32,
            color: colors.gray,
            fontWeight: 'bold',
            marginTop: sizes.xs,
        },
        subtitle: {
            color: colors.card,
            marginTop: sizes.xs,
            fontSize: sizes.smallText,
        },
        benefitsContainer: {},
        benefit: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 10,
        },
        benefitText: {
            textAlign: 'auto',
            color: colors.gray,
            fontSize: sizes.smallText,
            marginLeft: sizes.s,
        },
        buttonContainer: {
            alignItems: 'center',
            marginBottom: sizes.xl,
        },
        button: {
            borderRadius: sizes.m,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.cardBorder,
        },
        gradient: {
            paddingVertical: 14,
            alignItems: 'center',
            paddingHorizontal: sizes.l,
        },
        buttonText: {
            fontFamily: fonts.semibold,
            fontSize: 16,
        }
    });

    return (
        <LinearGradient colors={[colors.background.toString(), '#abadb3',]} style={styles.container}>
            <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
                <Icon name="crown" size={60} color={colors.gray}/>
                <AppText style={styles.title}>Go Premium+</AppText>
                <AppText style={styles.subtitle}>{getOfferText()}</AppText>
            </Animated.View>

            <View style={styles.benefitsContainer}>
                {benefits.map((text, index) => (
                    <Animated.View
                        key={text}
                        entering={FadeInUp.delay(index * 75).duration(600)}
                        style={styles.benefit}
                    >
                        <Icon name="check" size={22} color={colors.gray}/>
                        <AppText style={styles.benefitText}>{text}</AppText>
                    </Animated.View>
                ))}
            </View>

            <Animated.View entering={ZoomIn.delay(100)} style={styles.buttonContainer}>
                <TouchableOpacity disabled={buttonDisable} style={styles.button} onPress={() => handleUpgrade()}>
                    <LinearGradient colors={['#eed345', buttonDisable ? '#bababa' : '#f5c042']} style={styles.gradient}>
                        <AppText
                            style={styles.buttonText}>{isFreeTrialEligible(product) ? 'Start Free Trial!' : 'Upgrade Now!'}</AppText>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        </LinearGradient>
    );
};

export default PremiumScreen;
