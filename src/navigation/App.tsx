import React, {useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import {useFonts} from 'expo-font';
import {NavigationContainer} from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import {useData, ThemeProvider, TranslationProvider} from '../hooks';
import {View, StyleSheet} from 'react-native';
import Screens from "./Screens";
import {BottomMenu} from "../components";

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
            backgroundColor: '#eef8fa'
        },
    });

    return (
        <TranslationProvider>
            <ThemeProvider theme={theme} setTheme={setTheme}>
                <NavigationContainer>
                    <View style={styles.container}>
                        <Screens/>
                    </View>
                </NavigationContainer>
            </ThemeProvider>
        </TranslationProvider>
    );
};
