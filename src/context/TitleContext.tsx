import React, {createContext, useState} from 'react';

export const TitleContext = createContext(null);

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

