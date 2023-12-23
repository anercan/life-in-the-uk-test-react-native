import React, { useContext, useEffect, useState} from 'react';

import {
    ITheme,
} from '../constants/types';

import {light} from '../constants';

export const DataContext = React.createContext({});

export const DataProvider = ({children}: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<ITheme>(light);

    // change theme based on isDark updates
    useEffect(() => {
        setTheme(light);
    }, []);

    const contextValue = {
        theme,
        setTheme
    };

    return (
        <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext) as IUseData;
