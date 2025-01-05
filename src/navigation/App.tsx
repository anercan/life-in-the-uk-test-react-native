import React, {useContext, useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {useData, ThemeProvider} from '../hooks';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from "../context/AuthContext";
import {
    finishTransaction, flushFailedPurchasesCachedAsPendingAndroid, initConnection,
    ProductPurchase,
    Purchase,
    purchaseUpdatedListener,
    SubscriptionPurchase
} from "react-native-iap";
import useApiCaller from "../hooks/useApiCaller";
import {checkVersionWithStoresInfo} from "../util/CheckVersion";
import {THEME} from "../constants/theme";
//import * as SplashScreen from 'expo-splash-screen';

export default () => {
    const {apiCaller} = useApiCaller();
    const {theme, setTheme} = useData();
    const {login, isLoggedIn} = useContext(AuthContext);
    let purchaseUpdateSubscription;
        /*useFonts({
        'OpenSans-Light': theme.assets.OpenSansLight,
        'OpenSans-Regular': theme.assets.OpenSansRegular,
        'OpenSans-SemiBold': theme.assets.OpenSansSemiBold,
        'OpenSans-ExtraBold': theme.assets.OpenSansExtraBold,
        'OpenSans-Bold': theme.assets.OpenSansBold,
    });*/

    useEffect(() => {
        console.log("-----------------------AppTsx-----------------------");
        //SplashScreen.preventAutoHideAsync();
        checkVersionWithStoresInfo();
        Platform.OS === 'android' && StatusBar.setTranslucent(true);
        //hideSplashScreen();
        subscribeListener();
        return () => {
            StatusBar.setBarStyle('default');
        };
    }, []);


    /*const hideSplashScreen = async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        SplashScreen.hideAsync(); // Hide the splash screen
    };*/

    const subscribeListener = async () => {
        await initConnection().then((r) => {
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
        purchaseUpdateSubscription = purchaseUpdatedListener((purchase: SubscriptionPurchase | ProductPurchase) => {
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

   /* if (!fontsLoaded) {
        return null;
    }*/

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#e5e5e5',
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <View style={styles.container}>
                <NavigationContainer>
                    <Header/>
                    {isLoggedIn ? <TabMenu/> : <LoginStack/>}
                </NavigationContainer>
            </View>
        </ThemeProvider>
    );
};

const Stack = createStackNavigator();

const LoginStack = ({}) => (
    <Stack.Navigator>
        <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
        />
    </Stack.Navigator>
);

function getScreenOptions() {
    return {headerShown: false, cardStyle: {backgroundColor: '#e5e5e5'}};
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
                tabBarInactiveTintColor: '#d1d1d1', // Light gray color for inactive items
                tabBarLabelStyle: {
                    fontSize: 12, // Optional: customize font size
                }, tabBarStyle: {
                    backgroundColor: THEME.colors.primary, // Dark blue background
                    height: 80, // Custom height
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
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="home" color={color} size={size}/>
                    ),
                }}
            />
            <Tab.Screen
                name="SolvedQuizListScreens"
                component={SolvedQuizListStack}
                options={{
                    tabBarLabel: 'My Quizzes',
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="file-document-multiple" color={color} size={size}/>
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
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="account" color={color} size={size}/>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

