import {ITheme} from "constants/types";
import {ASSETS, COLORS, FONTS, ICONS, LINE_HEIGHTS, SIZES, SPACING, WEIGHTS} from "constants/theme/theme";

/*export const DARK_COLORS: ThemeColors = {
    // default text color
    text: '#cdcccc',
    // base colors
    /!** UI color for #primary *!/
    primary: '#084a86',
    /!** UI color for #secondary *!/
    secondary: '#395e90', // '#8392AB',
    /!** UI color for #tertiary *!/
    tertiary: '#E8AE4C',

    // non-colors
    black: '#252F40',
    white: '#FFFFFF',

    dark: '#252F40',
    light: '#2f91f3',

    // gray variations
    /!** UI color for #gray *!/
    gray: '#A7A8AE',
    // colors variations
    /!** UI color for #danger *!/
    danger: '#9e0202',
    /!** UI color for #warning *!/
    warning: '#f6c93d',
    /!** UI color for #success *!/
    success: '#06c23f',
    /!** UI color for #info *!/
    info: '#0297b8',

    /!** UI colors for navigation & card *!/
    card: '#f0f6db',
    background: '#32578b',
    secondaryBackground:'#787878',

    /!** UI color for shadowColor *!/
    shadow: '#000000',

    /!** UI color for input borderColor on focus *!/
    focus: '#b2f6f6',
    input: '#252F40',

    /!** UI color for switch checked/active color *!/
    switchOn: '#3A416F',
    switchOff: '#E9ECEF',

    /!** UI color for checkbox icon checked/active color *!/
    checkbox: ['#3A416F', '#141727'],
    checkboxIcon: '#FFFFFF',

    /!** icon tint color *!/
    icon: '#8392AB',

    /!** blur tint color *!/
    blurTint: 'light',

    /!** product link color *!/
    link: '#b2f6f6',
};*/


export const THEME: ITheme = {
    colors: COLORS,
    sizes: {...SIZES, ...SPACING},
    assets: {...ICONS, ...ASSETS},
    icons: ICONS,
    fonts: FONTS,
    weights: WEIGHTS,
    lines: LINE_HEIGHTS
};
