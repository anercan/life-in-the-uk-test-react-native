import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
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
import useApiCaller from "../hooks/useApiCaller";
import {getUserId} from "util/jwtUtil";
import {getItemOfferText, isAndroid, isFreeTrialEligible} from "util/commonUtil";
import {logEvent} from "util/logUtil";

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
    const {apiCaller} = useApiCaller();
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
            fontFamily: fonts.text,
            fontSize: 32,
            color: colors.gray,
            fontWeight: 'bold',
            marginTop: sizes.xs,
        },
        subtitle: {
            color: colors.card,
            marginTop: sizes.xs,
            fontSize: sizes.smallText,
            fontFamily: fonts.text,
            textAlign: 'center',
        },
        benefitsContainer: {},
        benefit: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 10,
        },
        benefitText: {
            color: colors.gray,
            fontSize: sizes.smallText,
            fontFamily: fonts.text,
            marginLeft: sizes.s,
        },
        buttonContainer: {
            alignItems: 'center',
            marginBottom: sizes.xl,
        },
        button: {
            borderRadius: sizes.m,
            overflow: 'hidden',
            borderWidth:1,
            borderColor:colors.cardBorder,
        },
        gradient: {
            paddingVertical: 14,
            alignItems: 'center',
            paddingHorizontal: sizes.l,
        },
        buttonText: {
            fontFamily: fonts.semibold,
            color: colors.text,
            fontSize: 16,
        }
    });

    return (
        <LinearGradient colors={[colors.background.toString(), '#abadb3',]} style={styles.container}>
            <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
                <Icon name="crown" size={60} color={colors.gray}/>
                <Text style={styles.title}>Go Premium+</Text>
                <Text style={styles.subtitle}>{getOfferText()}</Text>
            </Animated.View>

            <View style={styles.benefitsContainer}>
                {benefits.map((text, index) => (
                    <Animated.View
                        key={text}
                        entering={FadeInUp.delay(index * 75).duration(600)}
                        style={styles.benefit}
                    >
                        <Icon name="check" size={22} color={colors.gray}/>
                        <Text style={styles.benefitText}>{text}</Text>
                    </Animated.View>
                ))}
            </View>

            <Animated.View entering={ZoomIn.delay(100)} style={styles.buttonContainer}>
                <TouchableOpacity disabled={buttonDisable} style={styles.button} onPress={() => handleUpgrade()}>
                    <LinearGradient colors={['#eed345', buttonDisable ? '#bababa' : '#f5c042']} style={styles.gradient}>
                        <Text
                            style={styles.buttonText}>{isFreeTrialEligible(product) ? 'Start Free Trial!' : 'Upgrade Now!'}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        </LinearGradient>
    );
};

export default PremiumScreen;
