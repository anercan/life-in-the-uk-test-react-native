import React, {createContext, useState, useEffect} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        checkLoginStatus().then(r => console.log(r));
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
        console.log("Logout internal called");
        AsyncStorage.removeItem('authToken')
            .then(() => setIsLoggedIn(false));
    };

    return (
        <AuthContext.Provider value={{isLoggedIn, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

