import 'react-native-gesture-handler';
import React from 'react';

import {DataProvider} from './src/hooks';
import AppNavigation from './src/navigation/App';
import {AuthProvider} from "./src/context/AuthContext";

export default function App() {

    return (
        <AuthProvider>
            <DataProvider>
                <AppNavigation/>
            </DataProvider>
        </AuthProvider>
    );
}
