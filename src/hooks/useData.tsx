import React, {useCallback, useContext, useEffect, useState} from 'react';
import Storage from '@react-native-async-storage/async-storage';
import {darkTheme, lightTheme} from '../constants/theme';
import {ITheme} from "constants/types";

export const DataContext = React.createContext({});

export const DataProvider = ({children}: {children: React.ReactNode}) => {
    const [isDark, setIsDark] = useState(false);
    const [theme, setTheme] = useState<ITheme>(lightTheme);

    const getIsDark = useCallback(async () => {
        const isDarkJSON = await Storage.getItem('setting.isDark');
        if (isDarkJSON !== null) {
            setIsDark(JSON.parse(isDarkJSON));
        }
    }, [setIsDark]);

    useEffect(() => {
        getIsDark();
    }, [getIsDark]);

    useEffect(() => {
        Storage.setItem('setting.isDark', String(isDark));
        setTheme(isDark ? darkTheme : lightTheme );
    }, [isDark]);

    const contextValue = {
        isDark,
        setIsDark,
        theme,
        setTheme
    };

    return (
        <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext) as any;
