import React, {createContext, useState, useEffect} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [autoLogin, setAutoLogin] = useState(true);

    useEffect(() => {
        checkLoginStatus();
    }, []);

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

    const login = async (token) => {
        AsyncStorage.setItem('authToken', token)
            .then(() => setIsLoggedIn(true));
    };

    const logout = async () => {
        setAutoLogin(false);
        console.log("Logout internal called");
        AsyncStorage.removeItem('authToken')
            .then(() => setIsLoggedIn(false));
    };

    return (
        <AuthContext.Provider value={{isLoggedIn,autoLogin, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

