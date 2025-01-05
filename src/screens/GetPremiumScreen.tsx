import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Dimensions, FlatList, Platform, ScrollView, StatusBar, Text, TouchableOpacity} from 'react-native';
import {View, StyleSheet} from 'react-native';
import useTheme from "../hooks/useTheme";
import {useFocusEffect} from "@react-navigation/native";
import {TitleContext} from "../context/TitleContext";
import {
    finishTransaction,
    flushFailedPurchasesCachedAsPendingAndroid,
    getSubscriptions,
    initConnection, ProductPurchase, Purchase, PurchaseError,
    purchaseErrorListener,
    purchaseUpdatedListener,
    requestSubscription, SubscriptionPurchase
} from 'react-native-iap';
import {AuthContext} from "../context/AuthContext";
import useApiCaller from "../hooks/useApiCaller";
import {checkVersionWithStoresInfo} from "../util/CheckVersion";

//const items = Platform.select({android: ['level1'], ios: []});
let monthlySubProductId = 'level1';

const GetPremiumScreen = ({navigation}) => {
    const {apiCaller} = useApiCaller();
    const {fonts,sizes} = useTheme();
    const {login} = useContext(AuthContext);
    const {setTitle} = useContext(TitleContext);
    const [product, setProduct] = useState<any>();
    const [buttonDisable, setButtonDisable] = useState<boolean>(false);
    let purchaseErrorSubscription;
    let purchaseUpdateSubscription = null;

    useEffect(() => {
        init();
        setTitle('Subscription');
        return () => {
            purchaseUpdateSubscription?.remove();
            purchaseErrorSubscription?.remove();
        };
    }, []);

    async function init() {
        initConnection().then(() => {
            getSubscriptions({'skus': [monthlySubProductId]})
                .then((r: any) => {
                    setProduct(r[0]);
                })
                .catch(() => setButtonDisable(true));

            flushFailedPurchasesCachedAsPendingAndroid().then(() => subscriptionListener());
        });
    }

    const consumeGooglePlayDeliveryResult = async (purchaseResult: Purchase, serviceResult: unknown) => {
        if (serviceResult) {
            setButtonDisable(true);
            login(serviceResult.jwt);
            await finishTransaction({purchase: purchaseResult, isConsumable: false})
            navigation.navigate('Profile');
        } else {
            setButtonDisable(false);
        }
    }

    function subscriptionListener() {
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

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection:'column',
            marginTop:sizes.xl,
            alignItems:"center"
        },
        card: {
            flex:7,
            width: '80%',
            backgroundColor: '#3d3c3c',
            borderRadius: sizes.m,
            shadowColor: '#363535',
            shadowOffset: {width: 0, height: 5},
            shadowOpacity: 0.6,
            shadowRadius: 2,
            elevation: 4,
            flexDirection:'column',
            marginBottom:'5%'
        },
        headerText: {
            fontSize: sizes.h1,
            fontWeight: 'bold',
            marginVertical: sizes.m,
            textAlign: 'center',
            color: '#ffffff',
            fontFamily: fonts.medium,
        },
        priceText: {
            fontSize: sizes.h3,
            fontWeight: 'bold',
            marginBottom: sizes.m,
            textAlign: 'center',
            color: '#e2e2e2',
            fontFamily: fonts.medium,
        },
        featureList: {
            backgroundColor: '#535353',
            borderRadius: sizes.m,
            marginTop: sizes.m,
            paddingTop: sizes.sm,
            marginHorizontal: sizes.xs,
            marginBottom: sizes.base * 9
        },
        featureItem: {
            marginVertical: sizes.s,
        },
        featureText: {
            fontSize: sizes.h3,
            textAlign: 'center',
            fontFamily: fonts.thin,
            color: '#ffffff'
        },
        upgradeButton: {
            backgroundColor: buttonDisable ? '#a5aaac' : '#013971',
            paddingVertical: sizes.sm,
            paddingHorizontal: sizes.m,
            borderRadius: sizes.sm,
            shadowColor: '#959595',
            shadowOffset: {width: 0, height: 5},
            shadowOpacity: 0.6,
            shadowRadius: 2,
            elevation: 4,
        },
        upgradeButtonText: {
            color: '#fff',
            fontSize: sizes.p,
            fontFamily: fonts.medium,
        },
        footerText: {
            marginTop: sizes.xs,
            fontSize: sizes.h5,
            color: '#888',
            textAlign: 'center',
        },
    });

    const premiumFeatures = [
        'Access to Premium+ questions',
        'Get detailed statical data',
        'Compare your test results with others',
        'Early access to new features',
        'Activity reports',
        'Cancellation available anytime!'
    ];

    const renderFeature = (item:any) => (
        <View style={styles.featureItem}>
            <Text style={styles.featureText}>• {item}</Text>
        </View>
    );

    function getProductPrice() {
        let formattedPrice = product?.subscriptionOfferDetails[0]?.pricingPhases.pricingPhaseList[0]?.formattedPrice;
        return <>{formattedPrice}</>;
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={{justifyContent:'flex-start',flex:1.3}}>
                        <Text style={styles.headerText}>Unlock Premium+</Text>
                    </View>
                    <View style={{justifyContent:'center',flex:3,backgroundColor:'#535353',borderRadius:sizes.sm,marginHorizontal:sizes.m,paddingVertical:'7%'}}>
                        {premiumFeatures.map(feature => renderFeature(feature))}
                    </View>
                    <View style={{justifyContent:'flex-end',flex:1,marginTop:'5%'}}>
                        <Text style={styles.priceText}>For Just {getProductPrice()} Monthly!</Text>
                    </View>
                </View>
                <View style={{flex:5,justifyContent:'flex-start'}}>
                    <TouchableOpacity accessible={true}
                                      accessibilityLabel="Unlock Premium Subscription"
                                      style={styles.upgradeButton}
                                      disabled={buttonDisable}
                                      onPress={handleUpgrade}>
                        <Text style={styles.upgradeButtonText}>Unlock Premium+</Text>
                    </TouchableOpacity>
                    <Text style={styles.footerText}>Terms and Conditions apply</Text>
                </View>
            </View>
        </ScrollView>
    );
};
export default GetPremiumScreen
