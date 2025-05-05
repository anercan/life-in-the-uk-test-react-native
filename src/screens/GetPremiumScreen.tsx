import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity} from 'react-native';
import {View, StyleSheet} from 'react-native';
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
import useApiCaller from "../hooks/useApiCaller";
import {getUserId} from "util/jwtUtil";
import Animated, {FadeIn} from "react-native-reanimated";
import {getBillingPeriod, isAndroid, isFreeTrialEligible} from "util/commonUtil";
import {logEvent} from "util/logUtil";

let monthlySubProductId = 'level1';

const GetPremiumScreen = ({navigation}) => {
    const {apiCaller} = useApiCaller();
    const {fonts, sizes, colors} = useTheme();
    const {login} = useContext(AuthContext);
    const {setTitle} = useContext(TitleContext);
    const [product, setProduct] = useState<any>();
    const [buttonDisable, setButtonDisable] = useState<boolean>(true);
    const [isCardEntering, setCardEntering] = useState<boolean>(true);
    let purchaseErrorSubscription;
    let purchaseUpdateSubscription: any = null;
    useEffect(() => {
        setTimeout(() => {
            setCardEntering(false);
        }, 1000);
        init();
        setTitle('Subscription Plan');
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
                        apiCaller('user-management/google-play-subscribe', 'POST', purchase)
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
        let billingPeriod = getBillingPeriod(product?.subscriptionOfferDetails[item]?.pricingPhases.pricingPhaseList[0]?.billingPeriod);
        let formattedPrice = product?.subscriptionOfferDetails[item]?.pricingPhases.pricingPhaseList[0]?.formattedPrice;
        return formattedPrice + '/' + billingPeriod;
    }

    const premiumFeatures = [
        'Access to Premium+ quizzes',
        'Limitless personal daily challenges',
        'Get detailed statistical data',
        'Compare your test results with others',
        'Activity report',
        'All Official questions',
        'Cancellation is available anytime!'
    ];

    const renderFeature = (item: any) => (
        <View style={styles.featureItem}>
            <Text style={styles.featureText}>• {item}</Text>
        </View>
    );

    const styles = StyleSheet.create({
        title: {
            color: colors.text,
            fontSize: sizes.h1,
            fontFamily: fonts.p,
            fontWeight: "bold",
            marginBottom: sizes.m,
        },
        planContainer: {
            marginTop: sizes.xl,
            marginBottom: sizes.xl,
            width: "100%",
            alignItems: "center",
        },
        plan: {
            padding: sizes.m,
            borderRadius: sizes.sm,
            backgroundColor: colors.card,
            shadowColor: colors.shadow,
            shadowOpacity: 0.1,
            shadowRadius: 10,
            alignItems: "center",
            width: "90%",
            elevation: isCardEntering ? 0 : 1
        },
        planTitle: {
            color: colors.text,
            fontSize: sizes.h2,
            fontWeight: "bold",
            fontFamily: fonts.p,
            marginBottom: sizes.s,
        },
        planPrice: {
            color: "#062e5a",
            fontSize: sizes.p,
            fontWeight: 'bold',
            fontFamily: fonts.p,
            marginBottom: sizes.sm,
            marginTop: sizes.s,
            textDecorationLine: 'underline'
        },
        planDescription: {marginBottom: sizes.sm},
        button: {
            paddingVertical: sizes.sm,
            paddingHorizontal: sizes.l,
            borderRadius: sizes.xxl,
            marginTop: sizes.md,
            alignItems: "center",
            backgroundColor: buttonDisable ? '#bababa' : colors.primary,
            shadowColor: colors.shadow,
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: isCardEntering ? 0 : 2,
        },
        buttonText: {
            color: "white",
            fontSize: sizes.h3,
            fontFamily: fonts.text,
            fontWeight: "bold",
        },
        featureItem: {
            marginVertical: sizes.s,
        },
        featureText: {
            fontSize: sizes.h3,
            textAlign: 'center',
            fontFamily: fonts.p,
            color: colors.text,
        },
    });

    const getOfferText = () => {
        if (product) {
            return product && isFreeTrialEligible(product) ? getProductOffer(0) + ' then ' + getProductOffer(1) : getProductOffer(0);
        }
        return '';
    }

    return (
        <ScrollView contentContainerStyle={{
            alignItems: 'center',
            padding: sizes.s,
        }}>
            <Animated.View entering={FadeIn.duration(400)} style={styles.planContainer}>
                <Text style={styles.title}>Premium+ Plan</Text>
                <View style={styles.plan}>
                    <Text style={styles.planTitle}>Unlock Full Access</Text>
                    <Text style={styles.planPrice}>{getOfferText()}</Text>
                    <View style={styles.planDescription}>
                        {premiumFeatures.map((feature, index) => (
                            <View key={index}>
                                {renderFeature(feature)}
                            </View>
                        ))}
                    </View>
                </View>
                <TouchableOpacity disabled={buttonDisable} onPress={handleUpgrade} style={styles.button}>
                    <Text style={styles.buttonText}>
                        {isFreeTrialEligible(product) ? 'Start Free Trial!' : 'Upgrade Now'}
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </ScrollView>
    );

};
export default GetPremiumScreen
