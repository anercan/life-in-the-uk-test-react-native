import React, {createContext, useState} from 'react';
import analytics from "@react-native-firebase/analytics";

export const TitleContext = createContext(null);

export const TitleProvider = ({children}) => {
    const [title, setTitleInternal] = useState('');

    const setTitle = (title) => {
        logScreenEvent(title)
        setTitleInternal(title)
    };

    const logScreenEvent = (title) => {
        analytics()?.logScreenView({
            screen_name: title,
            screen_class: title
        });
    }

    const getTitle = () => {
        return title;
    };

    return (
        <TitleContext.Provider value={{getTitle, setTitle}}>
            {children}
        </TitleContext.Provider>
    );
};

