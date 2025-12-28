import React from "react";
import {Text, TextProps, StyleSheet} from "react-native";
import {useTheme} from "hooks";

interface AppTextProps extends TextProps {
    children: React.ReactNode;
    style?: TextProps["style"];
}

const AppText: React.FC<AppTextProps> = ({children, style, ...rest}) => {
    const {fonts, colors, sizes} = useTheme();

    const styles = StyleSheet.create({
        default: {
            textAlign: "center",
            fontSize: sizes.text,
            color: colors.text,
            fontFamily: fonts.text
        },
    });

    return (
        <Text style={[styles.default, style]} {...rest}>
            {children}
        </Text>
    );
};



export default React.memo(AppText);
