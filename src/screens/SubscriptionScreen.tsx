import React, {useContext, useState} from 'react';
import {View, StyleSheet, ActivityIndicator, ScrollView} from 'react-native';
import {finishTransaction, useIAP} from 'react-native-iap';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {FadeInDown, FadeInUp, ZoomIn} from 'react-native-reanimated';
import SubscriptionItem from 'components/SubscriptionItem';
import BenefitsList from 'components/BenefitsList';
import {AppLogo, AppText} from 'components/index';
import useTheme from '../hooks/useTheme';
import {AuthContext} from 'context/AuthContext';
import {useUserManagementService} from 'services/UserManagementService';
import {getUserId} from 'util/jwtUtil';
import {logEvent} from 'util/logUtil';
import {isAndroid} from 'util/commonUtil';
import {TitleContext} from "context/TitleContext";
import {SUBSCRIPTION_SKUS} from 'util/subscriptionUtils';

const SubscriptionScreen = ({navigation}) => {
    const {fonts, sizes, colors} = useTheme();
    const {login} = useContext(AuthContext);
    const {googleSubscribe} = useUserManagementService(navigation);
    const [purchasing, setPurchasing] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const {setTitle} = useContext(TitleContext);
    const {connected, subscriptions, fetchProducts} = useIAP({
        onPurchaseSuccess: async (purchase) => {
            try {
                if (isAndroid()) {
                    console.log(purchase);
                    const result = await googleSubscribe(purchase);
                    if (result?.jwt) {
                        login(result.jwt);
                        await finishTransaction({purchase, isConsumable: false});
                        logSubscription();
                        navigation.navigate('SettingsScreen');
                    }
                } else {
                    //todo iOS purchase flow
                    await finishTransaction({purchase, isConsumable: false});
                    logSubscription();
                    navigation.navigate('SettingsScreen');
                }
            } catch (e) {
                logPurchaseError(e);
            } finally {
                setPurchasing(false);
            }
        },
        onPurchaseError: (error) => {
            setPurchasing(false);
            logPurchaseError(error);
            return;
        }
    });

    React.useEffect(() => {
        setTitle('Premium+');
        if (connected) {
            fetchProducts({skus: SUBSCRIPTION_SKUS, type: 'subs'});
        }
    }, [connected]);

    React.useEffect(() => {
        if (subscriptions.length > 0 && !selectedId) {
            // Auto-select first subscription
            setSelectedId(subscriptions[0].id);
        }
    }, [subscriptions]);

    const logSubscription = () => {
        try {
            getUserId().then(userId => logEvent('subscription', {userId}));
        } catch {
            logEvent('analyticError');
        }
    };

    const logPurchaseError = (e: any) => {
        getUserId().then(userId =>
            logEvent('error_purchase', {userId, error: e?.message || e}),
        );
    };

    const handlePurchase = () => {
        setPurchasing(true);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        scrollContent: {
            flexGrow: 1,
            justifyContent: 'space-between',
            paddingBottom: sizes.xl,
        },
        headerSection: {
            alignItems: 'center',
            paddingTop: sizes.md,
            paddingHorizontal: sizes.m,
        },
        logoContainer: {
            borderRadius: 45,
            backgroundColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: sizes.s,
        },
        title: {
            fontSize: 28,
            fontFamily: fonts.bold,
            color: '#FFFFFF',
            marginBottom: sizes.xs,
        },
        subtitle: {
            fontSize: sizes.smallText,
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            lineHeight: 22,
        },
        benefitsSection: {
            paddingHorizontal: sizes.m,
            marginTop: sizes.m,
        },
        plansSection: {
            paddingHorizontal: sizes.m,
            marginTop: sizes.m,
        },
        plansTitle: {
            fontSize: sizes.smallText,
            color: 'rgba(255,255,255,0.7)',
            fontFamily: fonts.semibold,
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: sizes.s,
            textAlign: 'center',
        },
        loadingContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: sizes.xl,
        },
        loadingText: {
            color: 'rgba(255,255,255,0.7)',
            marginTop: sizes.s,
            fontSize: sizes.smallText,
        }
    });

    return (
        <LinearGradient
            colors={[colors.background.toString(), '#979ca3', colors.background.toString()]}
            style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>

                {/* Header */}
                <Animated.View entering={FadeInDown.duration(800)} style={styles.headerSection}>
                    <View style={styles.logoContainer}>
                        <AppLogo size={100}/>
                    </View>
                    <AppText style={styles.title}>Go Premium+</AppText>
                    <AppText style={styles.subtitle}>
                        Unlock all features and supercharge your preparation
                    </AppText>
                </Animated.View>

                {/* Benefits */}
                <View style={styles.benefitsSection}>
                    <BenefitsList/>
                </View>

                {/* Plans */}
                <View style={styles.plansSection}>
                    {!connected || subscriptions.length === 0 ? (
                        <Animated.View entering={FadeInUp.duration(600)} style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#FFD700"/>
                            <AppText style={styles.loadingText}>Loading plans...</AppText>
                        </Animated.View>
                    ) : (
                        subscriptions.map((subscription, index) => (
                            <Animated.View
                                key={subscription.id}
                                entering={ZoomIn.delay(200 + index * 100).duration(500)}>
                                <SubscriptionItem
                                    subscription={subscription}
                                    isSelected={selectedId === subscription.id}
                                    isPurchasing={purchasing && selectedId === subscription.id}
                                    onSelect={() => setSelectedId(subscription.id)}
                                    onPurchase={handlePurchase}
                                />
                            </Animated.View>
                        ))
                    )}
                </View>
                {/* Footer */}
                {/*<Animated.View entering={FadeInUp.delay(600).duration(600)} style={styles.footer}>
                    <AppText style={styles.footerText}>
                        Payment will be charged to your {Platform.OS === 'ios' ? 'Apple ID' : 'Google Play'} account.
                        Subscription automatically renews unless cancelled at least 24 hours before the end of the current period.
                    </AppText>
                </Animated.View>*/}
            </ScrollView>
        </LinearGradient>
    );
};

export default SubscriptionScreen;
