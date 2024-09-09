import React, {createContext, useState, useEffect} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkLoginStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            let isLogin = token !== null;
            if (!isLogin) {
                await logout();
            }
            setIsLoggedIn(isLogin);
        } catch (error) {
            console.log('Error checking login status:', error);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const login = async (token) => {
        await AsyncStorage.setItem('authToken', token);
        setIsLoggedIn(true);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('authToken');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{isLoggedIn, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

