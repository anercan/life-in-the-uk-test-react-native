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
    LoginScreen,
    GetPremiumScreen,
    SettingsScreen
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
import {checkVersionWithStoresInfo} from "util/checkVersion";
import AppOnboarding from "components/Onboarding";
import {checkFirstLaunch} from "util/commonUtil";
import {darkTheme, lightTheme} from "constants/theme";
import AnalyseScreen from "screens/AnalyseScreen";

export default () => {
    const {apiCaller} = useApiCaller();
    const {isDark, theme, setTheme} = useData();
    const {login, isLoggedIn} = useContext(AuthContext);
    const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

    useEffect(() => {
        //crashlytics().log('App mounted');
        checkVersionWithStoresInfo();
        Platform.OS === 'android' && StatusBar.setTranslucent(true);
        subscribeListener();
        checkFirstLaunch().then((isFirst: boolean) => setIsFirstLaunch(isFirst))
        return () => {
            StatusBar.setBarStyle('default');
        };
    }, []);

    useEffect(() => {
        setTheme(isDark ? darkTheme : lightTheme);
    }, [isDark]);

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
            backgroundColor: lightTheme.colors.secondaryBackground,
        },
    });

    const getScreen = () => {
        if (isFirstLaunch) {
            return <AppOnboarding onDone={() => setIsFirstLaunch(false)}/>
        } else if (isLoggedIn) {
            return <TabMenu/>
        } else {
            return <LoginScreen/>
        }
    }

    return (
        <ThemeProvider theme={theme} setTheme={setTheme}>
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

const getScreenOptions = (color) => {
    return {headerShown: false, cardStyle: {backgroundColor: color}};
}

export const QuizGroupListStack = () => {
    const {isDark} = useData();

    return (
        <Stack.Navigator initialRouteName="QuizGroupListScreen" screenOptions={getScreenOptions(isDark ? darkTheme.colors.secondaryBackground : lightTheme.colors.secondaryBackground)}>
            <Stack.Screen name="QuizGroupListScreen" component={QuizGroupListScreen}/>
            <Stack.Screen name="QuizListScreen" component={QuizListScreen}/>
            <Stack.Screen name="QuizScreen" component={QuizScreen}/>
            <Stack.Screen name="CompletedQuizScreen" component={CompletedQuizScreen}/>

            <Stack.Screen name="GetPremiumScreen" component={GetPremiumScreen}/>
            <Stack.Screen name="SettingsScreen" component={SettingsScreen}/>
        </Stack.Navigator>
    );
};

export const SolvedQuizListStack = () => {
    const {isDark} = useData();

    return (
        <Stack.Navigator initialRouteName="SolvedQuizListScreen" screenOptions={getScreenOptions(isDark ? darkTheme.colors.secondaryBackground : lightTheme.colors.secondaryBackground)}>
            <Stack.Screen name="SolvedQuizListScreen" component={SolvedQuizListScreen}/>
            <Stack.Screen name="QuizScreen" component={QuizScreen}/>
            <Stack.Screen name="CompletedQuizScreen" component={CompletedQuizScreen}/>

            <Stack.Screen name="GetPremiumScreen" component={GetPremiumScreen}/>
            <Stack.Screen name="SettingsScreen" component={SettingsScreen}/>
        </Stack.Navigator>
    );
};

export const ProfileStack = () => {
    const {isDark} = useData();

    return (
        <Stack.Navigator initialRouteName="Profile" screenOptions={getScreenOptions(isDark ? darkTheme.colors.secondaryBackground : lightTheme.colors.secondaryBackground)}>
            <Stack.Screen name="Profile" component={Profile}/>
            <Stack.Screen name="QuizScreen" component={QuizScreen}/>
            <Stack.Screen name="CompletedQuizScreen" component={CompletedQuizScreen}/>

            <Stack.Screen name="AnalyseScreen" component={AnalyseScreen}/>
            <Stack.Screen name="GetPremiumScreen" component={GetPremiumScreen}/>
            <Stack.Screen name="SettingsScreen" component={SettingsScreen}/>
        </Stack.Navigator>
    );
};

const Tab = createBottomTabNavigator();

export const TabMenu = () => {
    const {isDark} = useData();

    return (

        <Tab.Navigator
            initialRouteName="QuizGroupListStack"
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false, // Hides label names
                tabBarActiveTintColor: '#ffffff', // White color for active items
                tabBarInactiveTintColor: '#9c9595', // Light gray color for inactive items
                tabBarStyle: {
                    borderTopWidth: 0,
                    backgroundColor: isDark ? darkTheme.colors.background : lightTheme.colors.background, // Dark blue background
                    height: Platform.OS === 'android' ? 75 : 75, // Custom height
                    paddingTop: 8
                },
            }}
        >
            <Tab.Screen
                name="QuizGroupListStack"
                component={QuizGroupListStack}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Feather name="home" color={color} size={size}/>
                    ),
                }}
            />
            <Tab.Screen
                name="SolvedQuizListScreens"
                component={SolvedQuizListStack}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Feather name="file" color={color} size={size}/>
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
                    tabBarIcon: ({color, size}) => (
                        <Feather name="user" color={color} size={size}/>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

