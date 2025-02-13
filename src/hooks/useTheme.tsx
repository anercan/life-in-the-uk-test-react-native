import React from 'react';

import {defaultTheme} from '../constants/';
import {ITheme, IThemeProvider} from 'constants/types';

export const ThemeContext = React.createContext(null);

export const ThemeProvider = ({
  children,
  theme = defaultTheme,
  //setTheme = () => {},
}: IThemeProvider) => {
  return (

    <ThemeContext.Provider value={{theme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export default function useTheme(): ITheme {
  const {theme} = React.useContext(ThemeContext);
  return theme;
}
