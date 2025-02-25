import React, {useContext, useEffect, useState} from 'react';
import {Platform, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {useData, ThemeProvider} from 'hooks';
import {View, StyleSheet} from 'react-native';
import Header from "../components/Header";
import {createStackNavigator} from "@react-navigation/stack";
import {
    Profile,
    QuizGroupListScreen,
    QuizListScreen,
    QuizScreen,
    SolvedQuizListScreen,
    CompletedQuizScreen,
    LoginScreen, GetPremiumScreen
} from "../screens";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Feather from "react-native-vector-icons/Feather";
import {AuthContext} from "context/AuthContext";
import {
    finishTransaction, flushFailedPurchasesCachedAsPendingAndroid, initConnection,
    ProductPurchase,
    Purchase,
    purchaseUpdatedListener,
    SubscriptionPurchase
} from "react-native-iap";
import useApiCaller from "../hooks/useApiCaller";
import {checkVersionWithStoresInfo} from "util/CheckVersion";
import {COLORS, normalizeFont} from "constants/theme";
import crashlytics from "@react-native-firebase/crashlytics";
import AppOnboarding from "components/Onboarding";
import {checkFirstLaunch} from "util/CommonUtil";
import analytics from "@react-native-firebase/analytics";

export default () => {
    const {apiCaller} = useApiCaller();
    const {theme} = useData();
    const {login, isLoggedIn} = useContext(AuthContext);
    const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

    useEffect(() => {
        crashlytics().log('App mounted');
        checkVersionWithStoresInfo();
        Platform.OS === 'android' && StatusBar.setTranslucent(true);
        subscribeListener();
        checkFirstLaunch().then((isFirst: boolean) => setIsFirstLaunch(isFirst))
        return () => {
            StatusBar.setBarStyle('default');
        };
    }, []);

    const subscribeListener = async () => {
        await initConnection().then(() => {
            flushFailedPurchasesCachedAsPendingAndroid().then(() => subscriptionListener())
        });
    }

    const consumeGooglePlayDeliveryResult = async (purchaseResult: Purchase, serviceResult: any) => {
        if (serviceResult) {
            await finishTransaction({purchase: purchaseResult, isConsumable: false});
            await login(serviceResult.jwt);
        }
    }

    const subscriptionListener = () => {
        purchaseUpdatedListener((purchase: SubscriptionPurchase | ProductPurchase) => {
                console.log('subscriptionListener called')
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
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.background,
        },
    });

    const getScreen = () => {
        if (isFirstLaunch) {
            analytics()?.logEvent('first_launch', {date: new Date()})
            return <AppOnboarding onDone={() => setIsFirstLaunch(false)}/>
        } else if (isLoggedIn) {
            return <TabMenu/>
        } else {
            return <LoginScreen/>
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <View style={styles.container}>
                <NavigationContainer>
                    <Header/>
                    {getScreen()}
                </NavigationContainer>
            </View>
        </ThemeProvider>
    );
};

const Stack = createStackNavigator();

const getScreenOptions = () => {
    return {headerShown: false, cardStyle: {backgroundColor: COLORS.secondaryBackground}};
}

export const QuizGroupListStack = () => {
    return (
        <Stack.Navigator initialRouteName="QuizGroupListScreen" screenOptions={getScreenOptions()}>
            <Stack.Screen name="QuizGroupListScreen" component={QuizGroupListScreen}/>
            <Stack.Screen name="QuizListScreen" component={QuizListScreen}/>
            <Stack.Screen name="QuizScreen" component={QuizScreen}/>
            <Stack.Screen name="CompletedQuizScreen" component={CompletedQuizScreen}/>
            <Stack.Screen name="GetPremiumScreen" component={GetPremiumScreen}/>
        </Stack.Navigator>
    );
};

export const SolvedQuizListStack = () => {
    return (
        <Stack.Navigator initialRouteName="SolvedQuizListScreen" screenOptions={getScreenOptions()}>
            <Stack.Screen name="SolvedQuizListScreen" component={SolvedQuizListScreen}/>
            <Stack.Screen name="QuizScreen" component={QuizScreen}/>
            <Stack.Screen name="CompletedQuizScreen" component={CompletedQuizScreen}/>
            <Stack.Screen name="GetPremiumScreen" component={GetPremiumScreen}/>
        </Stack.Navigator>
    );
};

export const ProfileStack = () => {
    return (
        <Stack.Navigator initialRouteName="Profile" screenOptions={getScreenOptions()}>
            <Stack.Screen name="Profile" component={Profile}/>
            <Stack.Screen name="GetPremiumScreen" component={GetPremiumScreen}/>
        </Stack.Navigator>
    );
};

const Tab = createBottomTabNavigator();

export const TabMenu = () => {
    return (

        <Tab.Navigator
            initialRouteName="QuizGroupListStack"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#ffffff', // White color for active items
                //tabBarInactiveTintColor: '#cbcaca', // Light gray color for inactive items
                tabBarStyle: {
                    backgroundColor: COLORS.background, // Dark blue background
                    height: 70, // Custom height
                    paddingBottom: 4, // Optional: add padding for better item placement
                    paddingTop: 1, // Optional: add padding for better item placement
                },
            }}
        >
            <Tab.Screen
                name="QuizGroupListStack"
                component={QuizGroupListStack}
                options={{
                    tabBarLabel: 'Home',
                    tabBarLabelStyle: {
                        fontSize: normalizeFont(14),
                        fontFamily: 'OpenSans-Regular',
                        color: '#d9d8d8', // Optional: customize font size
                    },
                    tabBarIcon: ({color, size}) => (
                        <Feather name="home" color={color} size={size}/>
                    ),
                }}
            />
            <Tab.Screen
                name="SolvedQuizListScreens"
                component={SolvedQuizListStack}
                options={{
                    tabBarLabelStyle: {
                        fontSize: normalizeFont(14),
                        fontFamily: 'OpenSans-Regular',
                        color: '#d9d8d8', // Optional: customize font size
                    },
                    tabBarLabel: 'My Quizzes',
                    tabBarIcon: ({color, size}) => (
                        <Feather name="file-minus" color={color} size={size}/>
                    ),
                }}
            />
            {/*<Tab.Screen
                name="Notifications"
                component={SolvedQuizListScreen}
                options={{
                    tabBarLabel: 'Updates',
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="bell" color={color} size={size}/>
                    ),
                    tabBarBadge: 3,
                }}
            />*/}
            <Tab.Screen
                name="ProfileScreens"
                component={ProfileStack}
                options={{
                    tabBarLabelStyle: {
                        fontSize: normalizeFont(14),
                        fontFamily: 'OpenSans-Regular',
                        color: '#d9d8d8', // Optional: customize font size
                    },
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({color, size}) => (
                        <Feather name="user" color={color} size={size}/>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

