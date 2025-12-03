import * as React from 'react';
import {
    ColorValue,
    FlexStyle,
    TextStyle,
} from 'react-native';

// Spacing types
export interface ISpacing
    extends Pick<FlexStyle,
        | 'margin'
        | 'marginVertical'
        | 'marginHorizontal'
        | 'marginLeft'
        | 'marginRight'
        | 'marginTop'
        | 'marginBottom'
        | 'padding'
        | 'paddingVertical'
        | 'paddingHorizontal'
        | 'paddingLeft'
        | 'paddingRight'
        | 'paddingTop'
        | 'paddingBottom'> {
}

export type TWeight =
/** fontWeight: 400 */
    | 'normal'
    /** fontWeight: 100 */
    | 'thin'
    /** fontWeight: 200 */
    | 'extralight'
    /** fontWeight: 300 */
    | 'light'
    /** fontWeight: 500 */
    | 'medium'
    /** fontWeight: 600 */
    | 'semibold'
    /** fontWeight: 700 */
    | 'bold'
    /** fontWeight: 800 */
    | 'extrabold'
    /** fontWeight: 900 */
    | 'black';

export interface ITheme {
    colors: ThemeColors;
    sizes: ThemeSizes & ThemeSpacing;
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
    checkbox: string[];
    checkboxIcon: ColorValue;
    blurTint: 'light' | 'dark' | 'default';
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
    socialSize: number;
    socialRadius: number;
    socialIconSize: number;

    inputHeight: number;
    inputBorder: number;
    inputRadius: number;
    inputPadding: number;

    shadowOffsetWidth: number;
    shadowOffsetHeight: number;
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;

    cardRadius: number;
    cardPadding: number;

    imageRadius: number;
    avatarSize: number;
    avatarRadius: number;

    switchWidth: number;
    switchHeight: number;
    switchThumb: number;

    checkboxWidth: number;
    checkboxHeight: number;
    checkboxRadius: number;
    checkboxIconWidth: number;
    checkboxIconHeight: number;

    linkSize: number;

    multiplier: number;
}

export interface ThemeSpacing {
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
    text: TextStyle['fontWeight'];
    h1?: TextStyle['fontWeight'];
    h2?: TextStyle['fontWeight'];
    h3?: TextStyle['fontWeight'];
    h4?: TextStyle['fontWeight'];
    h5?: TextStyle['fontWeight'];
    p?: TextStyle['fontWeight'];

    thin: TextStyle['fontWeight'];
    extralight: TextStyle['fontWeight'];
    light: TextStyle['fontWeight'];
    normal: TextStyle['fontWeight'];
    medium: TextStyle['fontWeight'];
    semibold?: TextStyle['fontWeight'];
    bold?: TextStyle['fontWeight'];
    extrabold?: TextStyle['fontWeight'];
    black?: TextStyle['fontWeight'];
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
    extralight: string;
    light: string;
    normal: string;
    medium: string;
    bold: string;
    semibold: string;
    extrabold: string;
    black: string;
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
