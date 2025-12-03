import React from "react";
import {Text, TextProps, StyleSheet} from "react-native";
import {LIGHT_THEME} from "constants/theme/lightTheme";

interface AppTextProps extends TextProps {
    children: React.ReactNode;
    style?: TextProps["style"];
}

const AppText: React.FC<AppTextProps> = ({children, style, ...rest}) => {
    return (
        <Text style={[styles.default, style]} {...rest}>
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    default: {
        textAlign: "center",
        fontSize: LIGHT_THEME.sizes.text,
        color: LIGHT_THEME.colors.text,
        fontFamily: LIGHT_THEME.fonts.text
    },
});

export default AppText;
