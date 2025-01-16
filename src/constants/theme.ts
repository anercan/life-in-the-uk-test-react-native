import {Dimensions, PixelRatio, Platform} from 'react-native';
import {ITheme,
  ThemeAssets, ThemeColors,
  ThemeFonts, ThemeGradients,
  ThemeIcons,
  ThemeLineHeights, ThemeSizes, ThemeSpacing,
  ThemeWeights,
} from './types';

const {width, height} = Dimensions.get('window');

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
  text: 'normal',
  h1: Platform.OS === 'ios' ? '700' : 'normal',
  h2: Platform.OS === 'ios' ? '700' : 'normal',
  h3: Platform.OS === 'ios' ? '700' : 'normal',
  h4: Platform.OS === 'ios' ? '700' : 'normal',
  h5: Platform.OS === 'ios' ? '600' : 'normal',
  p: 'normal',

  thin: Platform.OS === 'ios' ? '100' : 'normal',
  extralight: Platform.OS === 'ios' ? '200' : 'normal',
  light: Platform.OS === 'ios' ? '300' : 'normal',
  normal: Platform.OS === 'ios' ? '400' : 'normal',
  medium: Platform.OS === 'ios' ? '500' : 'normal',
  semibold: Platform.OS === 'ios' ? '600' : 'normal',
  bold: Platform.OS === 'ios' ? '700' : 'normal',
  extrabold: Platform.OS === 'ios' ? '800' : 'normal',
  black: Platform.OS === 'ios' ? '900' : 'normal',
};

export const ICONS: ThemeIcons = {
  apple: require('../assets/icons/apple.png'),
  google: require('../assets/icons/google.png'),
  facebook: require('../assets/icons/facebook.png'),
  arrow: require('../assets/icons/arrow.png'),
  articles: require('../assets/icons/articles.png'),
  basket: require('../assets/icons/basket.png'),
  bell: require('../assets/icons/bell.png'),
  calendar: require('../assets/icons/calendar.png'),
  chat: require('../assets/icons/chat.png'),
  check: require('../assets/icons/check.png'),
  clock: require('../assets/icons/clock.png'),
  close: require('../assets/icons/close.png'),
  components: require('../assets/icons/components.png'),
  document: require('../assets/icons/document.png'),
  documentation: require('../assets/icons/documentation.png'),
  extras: require('../assets/icons/extras.png'),
  flight: require('../assets/icons/flight.png'),
  home: require('../assets/icons/home.png'),
  hotel: require('../assets/icons/hotel.png'),
  image: require('../assets/icons/image.png'),
  location: require('../assets/icons/location.png'),
  menu: require('../assets/icons/menu.png'),
  more: require('../assets/icons/more.png'),
  notification: require('../assets/icons/notification.png'),
  office: require('../assets/icons/office.png'),
  payment: require('../assets/icons/payment.png'),
  profile: require('../assets/icons/profile.png'),
  register: require('../assets/icons/register.png'),
  rental: require('../assets/icons/rental.png'),
  search: require('../assets/icons/search.png'),
  settings: require('../assets/icons/settings.png'),
  star: require('../assets/icons/star.png'),
  train: require('../assets/icons/train.png'),
  users: require('../assets/icons/users.png'),
  warning: require('../assets/icons/warning.png'),
};

export const ASSETS: ThemeAssets = {
  OpenSansLight: require('../assets/fonts/OpenSans-Light.ttf'),
  OpenSansRegular: require('../assets/fonts/OpenSans-Regular.ttf'),
  OpenSansSemiBold: require('../assets/fonts/OpenSans-SemiBold.ttf'),
  OpenSansExtraBold: require('../assets/fonts/OpenSans-ExtraBold.ttf'),
  OpenSansBold: require('../assets/fonts/OpenSans-Bold.ttf'),
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
  extralight: 'OpenSans-Light',
  light: 'OpenSans-Light',
  normal: 'OpenSans-Regular',
  medium: 'OpenSans-SemiBold',
  semibold: 'OpenSans-SemiBold',
  bold: 'OpenSans-Bold',
  extrabold: 'OpenSans-ExtraBold',
  black: 'OpenSans-ExtraBold',
};

export const LINE_HEIGHTS: ThemeLineHeights = {
  // font lineHeight
  text: normalize(15),
  h1: normalize(18),
  h2: normalize(20),
  h3: normalize(24),
  h4: normalize(15),
  h5: normalize(12),
  p: normalize(16),
};

export const COLORS: ThemeColors = {
  // default text color
  text: '#444444',
  // base colors
  /** UI color for #primary */
  primary: '#084a86',
  /** UI color for #secondary */
  secondary: '#395e90', // '#8392AB',
  /** UI color for #tertiary */
  tertiary: '#E8AE4C',

  // non-colors
  black: '#252F40',
  white: '#FFFFFF',

  dark: '#252F40',
  light: '#2f91f3',

  // gray variations
  /** UI color for #gray */
  gray: '#A7A8AE',
  darkGray: '#4f4f52',

  // colors variations
  /** UI color for #danger */
  danger: '#9e0202',
  /** UI color for #warning */
  warning: '#f6c93d',
  /** UI color for #success */
  success: '#06c23f',
  /** UI color for #info */
  info: '#0297b8',

  /** UI colors for navigation & card */
  card: '#f0f6db',
  background: '#e9e9ec',

  /** UI color for shadowColor */
  shadow: '#000000',
  overlay: 'rgba(0,0,0,0.3)',

  /** UI color for input borderColor on focus */
  focus: '#b2f6f6',
  input: '#252F40',

  /** UI color for switch checked/active color */
  switchOn: '#3A416F',
  switchOff: '#E9ECEF',

  /** UI color for checkbox icon checked/active color */
  checkbox: ['#3A416F', '#141727'],
  checkboxIcon: '#FFFFFF',

  /** social colors */
  facebook: '#3B5998',
  twitter: '#55ACEE',
  dribbble: '#b2f6f6',

  /** icon tint color */
  icon: '#8392AB',

  /** blur tint color */
  blurTint: 'light',

  /** product link color */
  link: '#b2f6f6',
};

export const GRADIENTS: ThemeGradients = {
  primary: ['#b2f6f6', '#7928CA'],
  secondary: ['#A8B8D8', '#627594'],
  info: ['#21D4FD', '#2152FF'],
  success: ['#98EC2D', '#17AD37'],
  warning: ['#FBCF33', '#F53939'],
  danger: ['#FF667C', '#EA0606'],

  light: ['#EBEFF4', '#CED4DA'],
  dark: ['#3A416F', '#141727'],

  white: [String(COLORS.white), '#ffffff'],
  black: [String(COLORS.black), '#141727'],

  divider: ['rgba(255,255,255,0.3)', 'rgba(102, 116, 142, 0.6)'],
  menu: [
    'rgba(255, 255, 255, 0.2)',
    'rgba(112, 125, 149, 0.5)',
    'rgba(255, 255, 255, 0.2)',
  ],
};

export const SIZES: ThemeSizes = {
  // global sizes
  base: normalize(7),
  radius: normalize(4),
  padding: normalize(30),

  // font sizes
  h1: normalizeFont(22),
  h2: normalizeFont(18),
  h3: normalizeFont(16),
  h4: normalizeFont(15),
  h5: normalizeFont(14),
  p: normalizeFont(17),
  text: normalizeFont(17),
  smallText: normalizeFont(15),

  // button sizes
  buttonBorder: normalize(1),
  buttonRadius: normalize(13),
  socialSize: normalize(64),
  socialRadius: normalize(16),
  socialIconSize: normalize(26),

  // button shadow
  shadowOffsetWidth: normalize(0),
  shadowOffsetHeight: normalize(7),
  shadowOpacity: 0.07,
  shadowRadius: normalize(4),
  elevation: 2,

  // input sizes
  inputHeight: normalize(46),
  inputBorder: normalize(1),
  inputRadius: normalize(8),
  inputPadding: normalize(12),

  // card sizes
  cardRadius: normalize(16),
  cardPadding: normalize(10),

  // image sizes
  imageRadius: normalize(14),
  avatarSize: normalize(32),
  avatarRadius: normalize(8),

  // switch sizes
  switchWidth: normalize(50),
  switchHeight: normalize(24),
  switchThumb: normalize(20),

  // checkbox sizes
  checkboxWidth: normalize(18),
  checkboxHeight: normalize(18),
  checkboxRadius: normalize(5),
  checkboxIconWidth: normalize(10),
  checkboxIconHeight: normalize(8),

  // product link size
  linkSize: normalize(12),

  /** font size multiplier: for maxFontSizeMultiplier prop */
  multiplier: 2,
};

export const SPACING: ThemeSpacing = {
  xs: SIZES.base * 0.5,
  s: SIZES.base,
  sm: SIZES.base * 2,
  m: SIZES.base * 3,
  md: SIZES.base * 4,
  l: SIZES.base * 5,
  xl: SIZES.base * 6,
  xxl: SIZES.base * 8,
  xxxl: SIZES.base * 15,
  xxxxl: SIZES.base * 25,
};

export const THEME: ITheme = {
  colors: COLORS,
  gradients: GRADIENTS,
  sizes: {...SIZES, ...SPACING},
  assets: {...ICONS, ...ASSETS},
  icons: ICONS,
  fonts: FONTS,
  weights: WEIGHTS,
  lines: LINE_HEIGHTS
};

