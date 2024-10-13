import React, {createContext, useState, useEffect} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const TitleContext = createContext({});

export const TitleProvider = ({children}) => {
    const [title, setTitleInternal] = useState('');

    const setTitle = (title) => {
        return setTitleInternal(title)
    };

    const getTitle = () => {
        return title;
    };

    return (
        <TitleContext.Provider value={{getTitle, setTitle}}>
            {children}
        </TitleContext.Provider>
    );
};

