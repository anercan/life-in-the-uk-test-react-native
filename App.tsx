import 'react-native-gesture-handler';
import React from 'react';
import {DataProvider} from './src/hooks';
import AppNavigation from './src/navigation/App';
import {AuthProvider} from "./src/context/AuthContext";
import {TitleProvider} from "./src/context/TitleContext";
import {QuizSettingsProvider} from "./src/context/QuizSettingsContext";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {COLORS} from "./src/constants/theme/lightTheme";
import SystemNavigationBar from 'react-native-system-navigation-bar';

export default function App() {
    SystemNavigationBar.setNavigationColor(COLORS.background?.toString());

    return (
        <SafeAreaProvider style={{backgroundColor: COLORS.background}}>
            <AuthProvider>
                <TitleProvider>
                    <DataProvider>
                        <QuizSettingsProvider>
                            <AppNavigation/>
                        </QuizSettingsProvider>
                    </DataProvider>
                </TitleProvider>
            </AuthProvider>
        </SafeAreaProvider>

    );
}
