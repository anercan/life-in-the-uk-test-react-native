import React from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import useTheme from '../hooks/useTheme';
import {IBlockProps} from "constants/types/components";

const Block = (props: IBlockProps) => {
  const {
    id = 'Block',
    children,
    style,
    shadow,
    card,
    center,
    outlined,
    overflow,
    row,
    safe,
    keyboard,
    scroll,
    color,
    gradient,
    primary,
    secondary,
    tertiary,
    black,
    white,
    gray,
    danger,
    warning,
    success,
    info,
    radius,
    height,
    width,
    justify,
    align,
    flex = 1,
    wrap,
    position,
    right,
    left,
    top,
    bottom,
    ...rest
  } = props;
  const {colors, sizes} = useTheme();

  const blockColor = color ? color : undefined;

  const blockStyles = StyleSheet.flatten([
    style,
    {
      ...(shadow && {
        shadowColor: colors.shadow,
        shadowOffset: {
          width: sizes.shadowOffsetWidth,
          height: sizes.shadowOffsetHeight,
        },
        shadowOpacity: sizes.shadowOpacity,
        shadowRadius: sizes.shadowRadius,
        elevation: sizes.elevation,
      }),
      ...(card && {
        backgroundColor: colors.card,
        borderRadius: sizes.cardRadius,
        padding: sizes.cardPadding,
        shadowColor: colors.shadow,
        shadowOffset: {
          width: sizes.shadowOffsetWidth,
          height: sizes.shadowOffsetHeight,
        },
        shadowOpacity: sizes.shadowOpacity,
        shadowRadius: sizes.shadowRadius,
        elevation: sizes.elevation,
      }),
      ...(radius && {borderRadius: radius}),
      ...(height && {height}),
      ...(width && {width}),
      ...(overflow && {overflow}),
      ...(flex !== undefined && {flex}),
      ...(row && {flexDirection: 'row'}),
      ...(align && {alignItems: align}),
      ...(center && {justifyContent: 'center'}),
      ...(justify && {justifyContent: justify}),
      ...(wrap && {flexWrap: wrap}),
      ...(blockColor && {backgroundColor: blockColor}),
      ...(outlined && {
        borderWidth: 1,
        borderColor: blockColor,
        backgroundColor: 'transparent',
      }),
      ...(position && {position}),
      ...(right !== undefined && {right}),
      ...(left !== undefined && {left}),
      ...(top !== undefined && {top}),
      ...(bottom !== undefined && {bottom}),
    },
  ]) as ViewStyle;

  // generate component testID or accessibilityLabel based on Platform.OS
  const blockID =
    Platform.OS === 'android' ? {accessibilityLabel: id} : {testID: id};

  if (safe) {
    return (
      <SafeAreaView {...blockID} {...rest} style={blockStyles}>
        {children}
      </SafeAreaView>
    );
  }

  if (scroll) {
    return (
      <ScrollView {...blockID} {...rest} style={blockStyles}>
        {children}
      </ScrollView>
    );
  }

  return (
    <View {...blockID} {...rest} style={blockStyles}>
      {children}
    </View>
  );
};

export default React.memo(Block);
