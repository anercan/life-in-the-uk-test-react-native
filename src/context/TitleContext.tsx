import React, {createContext, useState} from 'react';
import {logScreenEvent} from "util/logUtil";

export const TitleContext = createContext(null);

export const TitleProvider = ({children}) => {
    const [title, setTitleInternal] = useState('');

    const setTitle = (title) => {
        logScreenEvent(title)
        setTitleInternal(title)
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

