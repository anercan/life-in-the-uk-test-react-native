import {Dimensions, PixelRatio, Platform} from 'react-native';
import {
    ITheme,
    ThemeAssets, ThemeColors,
    ThemeFonts,
    ThemeLineHeights, ThemeSizes,
    ThemeWeights,
} from './theme';

const {width} = Dimensions.get('window');

// Scale based on device dimensions
const scale = width / 375;

// Normalize size for consistent scaling
const normalize = (size: number) => Math.round(scale * size);

export function normalizeFont(size) {
    const newSize = size * scale
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
}

export const WEIGHTS: ThemeWeights = {
    thin: Platform.OS === 'ios' ? '100' : 'normal',
    light: Platform.OS === 'ios' ? '300' : 'normal',
    normal: Platform.OS === 'ios' ? '400' : 'normal',
    medium: Platform.OS === 'ios' ? '500' : 'normal',
    semibold: Platform.OS === 'ios' ? '600' : 'normal',
    bold: Platform.OS === 'ios' ? '700' : 'normal',
};

export const ASSETS: ThemeAssets = {
    OpenSansLight: require('../../assets/fonts/OpenSans-Light.ttf'),
    OpenSansRegular: require('../../assets/fonts/OpenSans-Regular.ttf'),
    OpenSansSemiBold: require('../../assets/fonts/OpenSans-SemiBold.ttf'),
    OpenSansExtraBold: require('../../assets/fonts/OpenSans-ExtraBold.ttf'),
    OpenSansBold: require('../../assets/fonts/OpenSans-Bold.ttf'),
};

export const FONTS: ThemeFonts = {
    // based on font size
    text: 'OpenSans-Regular',
    h1: 'OpenSans-Bold',
    h2: 'OpenSans-Bold',
    h3: 'OpenSans-Bold',
    h4: 'OpenSans-Bold',
    h5: 'OpenSans-SemiBold',
    p: 'OpenSans-Regular',

    // based on fontWeight
    thin: 'OpenSans-Light',
    light: 'OpenSans-Light',
    normal: 'OpenSans-Regular',
    medium: 'OpenSans-SemiBold',
    semibold: 'OpenSans-SemiBold',
    bold: 'OpenSans-Bold',
    extrabold: 'OpenSans-ExtraBold',
};

export const LINE_HEIGHTS: ThemeLineHeights = {
    // font lineHeight
    text: normalize(15),
    h1: normalize(30),
    h2: normalize(28),
    h3: normalize(24),
    h4: normalize(15),
    h5: normalize(12),
    p: normalize(16),
};

export const COLORS: ThemeColors = {
    text: '#e5e4e4',
    primary: '#777d80',
    background: '#084a86',
    secondaryBackground: '#3e3d3d',
    tabBackground: '#777879',
    orderBoxBackGround: '#767474',
    secondary: '#a0b0ba', // '#8392AB',
    tertiary: '#E8AE4C',
    black: '#252F40',
    white: '#FFFFFF',
    dark: '#7f8282',
    light: '#b5b6ba',
    gray: '#f1f0f0',
    danger: '#9e0202',
    warning: '#f6c93d',
    success: '#06c23f',
    info: '#0297b8',
    card: '#716e6e',
    cardBorder: '#9a9494',
    shadow: '#363636',
    mediumGray: '#77777d',
    cardProgress: '#d9dadc',
    cardTab: '#afb1b3'
};

const baseSize = normalize(7);
export const SIZES: ThemeSizes = {
    // global sizes
    base: baseSize,
    radius: normalize(4),
    padding: normalize(30),

    // font sizes
    h1: normalizeFont(22),
    h2: normalizeFont(19),
    h3: normalizeFont(16),
    h4: normalizeFont(15),
    h5: normalizeFont(14),
    p: normalizeFont(17),
    text: normalizeFont(17),
    smallText: normalizeFont(15),
    smallestText: normalizeFont(12),

    // button sizes
    buttonBorder: normalize(1),
    buttonRadius: normalize(13),

    // button shadow
    shadowOffsetWidth: normalize(0),
    shadowOffsetHeight: normalize(7),
    shadowOpacity: 0.07,
    shadowRadius: normalize(4),
    elevation: 2,

    // card sizes
    cardRadius: normalize(16),
    cardPadding: normalize(10),

    // image sizes
    imageRadius: normalize(14),

    xs: baseSize * 0.5,
    s: baseSize,
    sm: baseSize * 2,
    m: baseSize * 3,
    md: baseSize * 4,
    l: baseSize * 5,
    xl: baseSize * 6,
    xxl: baseSize * 8,
    xxxl: baseSize * 15,
    xxxxl: baseSize * 25,

};

export const DARK_THEME: ITheme = {
    colors: COLORS,
    sizes: SIZES,
    assets: ASSETS,
    fonts: FONTS,
    weights: WEIGHTS,
    lines: LINE_HEIGHTS
};

