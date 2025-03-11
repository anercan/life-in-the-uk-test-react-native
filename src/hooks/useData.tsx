import React, { useContext, useEffect, useState} from 'react';
import {ITheme} from 'constants/types';
import {defaultTheme} from '../constants/theme';

export const DataContext = React.createContext({});

export const DataProvider = ({children}: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<ITheme>(defaultTheme);

    // change theme based on isDark updates
    useEffect(() => {
        setTheme(defaultTheme);
    }, []);

    const contextValue = {
        theme,
        setTheme
    };

    return (
        <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext) as any;
