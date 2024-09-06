import React, {useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import {useFonts} from 'expo-font';
import {NavigationContainer} from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import {useData, ThemeProvider} from '../hooks';
import {View, StyleSheet} from 'react-native';
import Header from "../components/Header";
import {createStackNavigator} from "@react-navigation/stack";
import {LoginScreen, Profile, QuizGroupListScreen, QuizListScreen, QuizScreen, SolvedQuizListScreen,CompletedQuizScreen} from "../screens";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default () => {
    const {isDark, theme, setTheme} = useData();

    /* set the status bar based on isDark constant */
    useEffect(() => {
        Platform.OS === 'android' && StatusBar.setTranslucent(true);
        StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
        return () => {
            StatusBar.setBarStyle('default');
        };
    }, [isDark]);

    // load custom fonts
    const [fontsLoaded] = useFonts({
        'OpenSans-Light': theme.assets.OpenSansLight,
        'OpenSans-Regular': theme.assets.OpenSansRegular,
        'OpenSans-SemiBold': theme.assets.OpenSansSemiBold,
        'OpenSans-ExtraBold': theme.assets.OpenSansExtraBold,
        'OpenSans-Bold': theme.assets.OpenSansBold,
    });

    if (fontsLoaded) {
        const hideSplash = async () => {
            await SplashScreen.hideAsync();
        };
        hideSplash();
    }

    if (!fontsLoaded) {
        return null;
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f3f0f0'
        },
    });

    return (
        <ThemeProvider theme={theme} setTheme={setTheme}>
            <NavigationContainer>
                <View style={styles.container}>
                    <Header/>
                    <TabMenu/>
                </View>
            </NavigationContainer>
        </ThemeProvider>
    );
};

const Stack = createStackNavigator();

export const QuizGroupListScreens = () => {
    return (
        <Stack.Navigator initialRouteName="QuizGroupListScreen" screenOptions={{headerShown: false}}>
            <Stack.Screen name="QuizGroupListScreen" component={QuizGroupListScreen}/>
            <Stack.Screen name="QuizListScreen" component={QuizListScreen}/>
            <Stack.Screen name="QuizScreen" component={QuizScreen}/>
            <Stack.Screen name="CompletedQuizScreen" component={CompletedQuizScreen}/>
        </Stack.Navigator>
    );
};

export const SolvedQuizListScreens = () => {
    return (
        <Stack.Navigator initialRouteName="SolvedQuizListScreen" screenOptions={{headerShown: false}}>
            <Stack.Screen name="SolvedQuizListScreen" component={SolvedQuizListScreen}/>
            <Stack.Screen name="QuizScreen" component={QuizScreen}/>
            <Stack.Screen name="CompletedQuizScreen" component={CompletedQuizScreen}/>
        </Stack.Navigator>
    );
};

export const ProfileScreens = () => {
    return (
        <Stack.Navigator initialRouteName="Profile" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Profile" component={Profile}/>
        </Stack.Navigator>
    );
};

const Tab = createBottomTabNavigator();

export const TabMenu = () => {
    return (
        <Tab.Navigator
            initialRouteName="QuizGroupListScreens"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#ffffff', // White color for active items
                tabBarInactiveTintColor: '#d1d1d1', // Light gray color for inactive items
                tabBarLabelStyle: {
                    fontSize: 12, // Optional: customize font size
                }, tabBarStyle: {
                    backgroundColor: '#012169', // Dark blue background
                    height: 80, // Custom height
                    paddingBottom: 4, // Optional: add padding for better item placement
                    paddingTop: 1, // Optional: add padding for better item placement
                },
            }}
        >
            <Tab.Screen
                name="QuizGroupListScreens"
                component={QuizGroupListScreens}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="home" color={color} size={size}/>
                    ),
                }}
            />
            <Tab.Screen
                name="SolvedQuizListScreens"
                component={SolvedQuizListScreens}
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
                component={ProfileScreens}
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

