import React, {useContext, useEffect, useState} from 'react';
import {Platform, Text, TouchableOpacity} from 'react-native';
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
import analytics from "@react-native-firebase/analytics";
import {getUserId} from "util/jwtUtil";
import Animated, {FadeIn, FadeOut} from "react-native-reanimated";
import {getBillingPeriod, isFreeTrialEligible} from "util/CommonUtil";

let monthlySubProductId = 'level1';

const GetPremiumScreen = ({navigation}) => {
    const {apiCaller} = useApiCaller();
    const {fonts, sizes, colors} = useTheme();
    const {login} = useContext(AuthContext);
    const {setTitle} = useContext(TitleContext);
    const [product, setProduct] = useState<any>();
    const [buttonDisable, setButtonDisable] = useState<boolean>(false);
    let purchaseErrorSubscription;
    let purchaseUpdateSubscription: any = null;

    useEffect(() => {
        init();
        setTitle('Subscription');
        logEvent();
        return () => {
            purchaseUpdateSubscription?.remove();
            purchaseErrorSubscription?.remove();
        };
    }, []);

    const logEvent = () => {
        analytics().logScreenView({
            screen_name: 'Get Premium',
            screen_class: 'GetPremium'
        });
    }

    const init = async () => {
        initConnection().then(() => {
            getSubscriptions({'skus': [monthlySubProductId]})
                .then((r: any) => {
                    setProduct(r[0]);
                })
                .catch(() => setButtonDisable(true));

            flushFailedPurchasesCachedAsPendingAndroid().then(() => subscriptionListener());
        });
    }

    const logSubscribtion = () => {
        try {
            getUserId().then(userId => analytics().logEvent('subscription', {userId: userId}));
        } catch (e) {
        }
    }

    const consumeGooglePlayDeliveryResult = async (purchaseResult: Purchase, serviceResult: any) => {
        if (serviceResult) {
            login(serviceResult.jwt);
            await finishTransaction({purchase: purchaseResult, isConsumable: false})
            navigation.navigate('Profile');
            logSubscribtion();
        } else {
            setButtonDisable(false);
        }
    }

    const subscriptionListener = () => {
        purchaseUpdateSubscription = purchaseUpdatedListener((purchase: SubscriptionPurchase | ProductPurchase) => {
                const receipt = purchase?.transactionReceipt;
                if (receipt) {
                    if (Platform.OS === 'android') {
                        apiCaller('user-management/google-play-subscribe', 'POST', purchase)
                            .then(async (deliveryResult) => {
                                await consumeGooglePlayDeliveryResult(purchase, deliveryResult);
                            });
                    }
                }
            },
        );

        purchaseErrorSubscription = purchaseErrorListener(
            (error: PurchaseError) => {
                analytics().logEvent('error_purchase', {
                    userId: getUserId(),
                    errorName: error.name,
                    errorMessage: error?.message,
                    errorCode: error.code
                })
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

    const getProductOffer = () => {
        let billingPeriod = getBillingPeriod(product?.subscriptionOfferDetails[0]?.pricingPhases.pricingPhaseList[0]?.billingPeriod);
        let formattedPrice = product?.subscriptionOfferDetails[0]?.pricingPhases.pricingPhaseList[0]?.formattedPrice;
        return formattedPrice + '/' + billingPeriod;
    }

    const premiumFeatures = [
        'Access to Premium+ quizzes',
        'Get detailed statical data',
        'Compare your test results with others',
        'Early access to new features',
        'Activity reports',
        'More than 500 official questions',
    ];

    const renderFeature = (item: any) => (
        <View style={styles.featureItem}>
            <Text style={styles.featureText}>• {item}</Text>
        </View>
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginTop: sizes.xxl,
            alignItems: "center",
            padding: sizes.m,
        },
        title: {
            color: colors.primary,
            fontSize: 28,
            fontFamily: fonts.p,
            fontWeight: "bold",
            marginBottom: sizes.m,
        },
        planContainer: {
            width: "100%",
            alignItems: "center",
        },
        plan: {
            padding: sizes.m,
            borderRadius: sizes.m,
            backgroundColor: "#fafafa",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5,
            alignItems: "center",
            width: "90%",
        },
        planTitle: {
            color: colors.primary,
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
        freeTrialText: {
            color: "#1a5ba0",
            fontSize: sizes.h2,
            fontWeight: 'bold',
            fontFamily: fonts.p,
            marginBottom: sizes.sm,
        },
        planDescription: {marginBottom: sizes.sm},
        button: {
            padding: sizes.sm,
            borderRadius: sizes.m,
            marginTop: sizes.m,
            width: "65%",
            alignItems: "center",
            backgroundColor: buttonDisable ? '#bababa' : colors.primary,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 5,
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
            color: "#4f5257",
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Premium+ Plan</Text>

            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.planContainer}>
                <View style={styles.plan}>
                    <Text style={styles.planTitle}>Unlock Full Access</Text>
                    {isFreeTrialEligible(product)}
                    <Text style={styles.planPrice}>{getProductOffer()}</Text>
                    <View style={styles.planDescription}>
                        {premiumFeatures.map((feature, index) => (
                            <View key={index}>
                                {renderFeature(feature)}
                            </View>
                        ))}
                    </View>
                </View>
            </Animated.View>

            <TouchableOpacity disabled={buttonDisable} onPress={handleUpgrade} style={styles.button}>
                <Text style={styles.buttonText}>
                    {isFreeTrialEligible(product) ? 'Start Free Trial!' : 'Upgrade Now'}
                </Text>
            </TouchableOpacity>
        </View>
    );

};
export default GetPremiumScreen
