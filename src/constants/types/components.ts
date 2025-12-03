import * as React from 'react';
import {
    StyleProp,
    ViewProps,
    ViewStyle,
} from 'react-native';

/**
 * ## Block
 * Default usage:
 * ```
 * <Block>...</Block>
 * ```
 *
 */
export interface IBlockProps extends ViewProps {
    /**
     * id for testID & accesibilityLabel
     */
    id?: string;
    /**
     * Renders a View flex style
     * @see https://reactnative.dev/docs/flexbox#proptypes
     * @see https://reactnative.dev/docs/layout-props
     */
    flex?: ViewStyle['flex'];
    /**
     * Renders a View flexDirection: row style
     * @see https://reactnative.dev/docs/flexbox#flex-direction
     */
    row?: boolean;
    /**
     * Renders a View flexWrap style
     * @see https://reactnative.dev/docs/flexbox#flex-wrap
     */
    wrap?: ViewStyle['flexWrap'];
    /**
     * Renders a SafeAreaView component
     * @see https://reactnative.dev/docs/safeareaview
     */
    safe?: boolean;
    /**
     * Renders a KeyboardAwareScrollView component
     * @see https://github.com/APSL/react-native-keyboard-aware-scroll-view#usage
     */
    keyboard?: boolean;
    /**
     * Renders a ScrollView component
     * @see https://reactnative.dev/docs/scrollview
     */
    scroll?: boolean;
    /**
     * Generates a shadow style
     * @see https://reactnative.dev/docs/shadow-props
     */
    shadow?: boolean;
    /**
     * Renders a View with predefined backgroundColor, borderRadius, padding, shadow / elevation
     * @see https://reactnative.dev/docs/shadow-props
     */
    card?: boolean;
    /**
     * Renders a View with predefined justifyContent: center
     * @see https://reactnative.dev/docs/flexbox#justify-content
     */
    center?: boolean;
    /**
     * Renders a View with predefined borderWidth: 1, backgroundColor: 'transparent' & borderColor inherited
     */
    outlined?: boolean;
    /**
     * Renders the View/Block component with custom style, overwrite existing/predefined styles
     * @see https://reactnative.dev/docs/view#style
     */
    style?: StyleProp<ViewStyle>;
    /**
     * Renders a View style overflow
     * @see https://reactnative.dev/docs/layout-props#overflow
     */
    overflow?: ViewStyle['overflow'];
    /**
     * Renders a custom backgroundColor
     * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
     */
    color?: ViewStyle['backgroundColor'];
    /**
     * Renders LinearGradient component, colors
     * @see https://docs.expo.io/versions/latest/sdk/linear-gradient/#props
     */
    gradient?: string[];
    /**
     * Renders a backgroundColor directly from the colors.primary value
     * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
     */
    primary?: boolean;
    /**
     * Renders a backgroundColor directly from the colors.secondary value
     * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
     */
    secondary?: boolean;
    /**
     * Renders a backgroundColor directly from the colors.tertiary value
     * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
     */
    tertiary?: boolean;
    /**
     * Renders a backgroundColor directly from the colors.black value
     * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
     */
    black?: boolean;
    /**
     * Renders a backgroundColor directly from the colors.white value
     * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
     */
    white?: boolean;
    /**
     * Renders a backgroundColor directly from the colors.gray value
     * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
     */
    gray?: boolean;
    /**
     * Renders a backgroundColor directly from the colors.danger value
     * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
     */
    danger?: boolean;
    /**
     * Renders a backgroundColor directly from the colors.warning value
     * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
     */
    warning?: boolean;
    /**
     * Renders a backgroundColor directly from the colors.success value
     * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
     */
    success?: boolean;
    /**
     * Renders a backgroundColor directly from the colors.info value
     * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
     */
    info?: boolean;
    /**
     * Renders a custom borderRadius value
     * @see https://reactnative.dev/docs/view-style-props#borderradius
     */
    radius?: ViewStyle['borderRadius'];
    /**
     * Renders a custom height value
     * @see https://reactnative.dev/docs/layout-props#height
     */
    height?: ViewStyle['height'];
    /**
     * Renders a custom width value
     * @see https://reactnative.dev/docs/layout-props#width
     */
    width?: ViewStyle['width'];
    /**
     * Renders a flex justifyContent
     * Available values: 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'
     * @see https://reactnative.dev/docs/layout-props#justifycontent
     */
    justify?: ViewStyle['justifyContent'];
    /**
     * Renders a flex alignItems
     * Available values: 'auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline'
     * @see https://reactnative.dev/docs/layout-props#alignitems
     */
    align?: ViewStyle['alignItems'];
    /**
     * Renders the View content
     */
    children?: React.ReactNode;
    /**
     * Renders the View position
     * @see https://reactnative.dev/docs/layout-props#position
     */
    position?: ViewStyle['position'];
    /**
     * Renders the View right offset
     * @see https://reactnative.dev/docs/layout-props#right
     */
    right?: ViewStyle['right'];
    /**
     * Renders the View left offset
     * @see https://reactnative.dev/docs/layout-props#left
     */
    left?: ViewStyle['left'];
    /**
     * Renders the View top offset
     * @see https://reactnative.dev/docs/layout-props#top
     */
    top?: ViewStyle['top'];
    /**
     * Renders the View bottom offset
     * @see https://reactnative.dev/docs/layout-props#bottom
     */
    bottom?: ViewStyle['bottom'];
}
