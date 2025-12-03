import React from 'react';

import {lightTheme} from '../constants/theme';
import {ITheme, IThemeProvider} from 'constants/theme/theme';

export const ThemeContext = React.createContext({
  theme: lightTheme,
  setTheme: () => {},
});

export const ThemeProvider = ({
                                children,
                                theme = lightTheme,
                                setTheme = () => {},
                              }: IThemeProvider) => {
  return (
      <ThemeContext.Provider value={{theme, setTheme}}>
        {children}
      </ThemeContext.Provider>
  );
};

export default function useTheme(): ITheme {
  const {theme} = React.useContext(ThemeContext);
  return theme;
}
