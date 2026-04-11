import * as React from 'react';
import {
    ColorValue,
    TextStyle,
} from 'react-native';

export interface ITheme {
    colors: ThemeColors;
    sizes: ThemeSizes;
    assets: ThemeAssets;
    fonts: ThemeFonts;
    weights: ThemeWeights;
    lines: ThemeLineHeights;
}

export interface IThemeProvider {
    children?: React.ReactNode;
    theme?: ITheme;
    setTheme?: () => void;
}

export interface ThemeColors {
    text: ColorValue;
    primary: ColorValue;
    secondary: ColorValue;
    tertiary: ColorValue;
    black: ColorValue;
    white: ColorValue;
    light: ColorValue;
    dark: ColorValue;
    gray: ColorValue;
    danger: ColorValue;
    warning: ColorValue;
    success: ColorValue;
    info: ColorValue;
    card: ColorValue;
    cardBorder: ColorValue;
    background: ColorValue;
    secondaryBackground: ColorValue;
    tabBackground: ColorValue;
    orderBoxBackGround: ColorValue;
    shadow: ColorValue;
    mediumGray: ColorValue;
    cardProgress: ColorValue;
    cardTab: ColorValue;
}

export interface ThemeSizes {
    base: number;
    text: number;
    radius: number;
    padding: number;

    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    p: number;
    smallText: number;
    smallestText: number;

    buttonBorder: number;
    buttonRadius: number;

    shadowOffsetWidth: number;
    shadowOffsetHeight: number;
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
    imageRadius: number,
    cardRadius: number;
    cardPadding: number;

    xs: number;
    s: number;
    sm: number;
    m: number;
    md: number;
    l: number;
    xl: number;
    xxl: number;
    xxxl: number;
    xxxxl: number;
}

export interface ThemeWeights {
    thin: TextStyle['fontWeight'];
    light: TextStyle['fontWeight'];
    normal: TextStyle['fontWeight'];
    medium: TextStyle['fontWeight'];
    semibold?: TextStyle['fontWeight'];
    bold?: TextStyle['fontWeight'];
}

export interface ThemeAssets {
    OpenSansLight?: any;
    OpenSansRegular?: any;
    OpenSansSemiBold?: any;
    OpenSansExtraBold?: any;
    OpenSansBold?: any;
}

export interface ThemeFonts {
    text: string;
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    p: string;
    thin: string;
    light: string;
    normal: string;
    medium: string;
    bold: string;
    semibold: string;
    extrabold: string;
}

export interface ThemeLineHeights {
    text: number;
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    p: number;
}
