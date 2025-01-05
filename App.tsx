import 'react-native-gesture-handler';
import React from 'react';

import {DataProvider} from './src/hooks';
import AppNavigation from './src/navigation/App';
import {AuthProvider} from "./src/context/AuthContext";
import {TitleProvider} from "./src/context/TitleContext";

export default function App() {

    return (
        <AuthProvider>
            <TitleProvider>
                <DataProvider>
                    <AppNavigation/>
                </DataProvider>
            </TitleProvider>
        </AuthProvider>
    );
}
