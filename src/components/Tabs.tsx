import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";
import {useTheme} from "../hooks";
import Block from "components/Block";

export interface IHeader {
    callback: (tabNumber: number) => void;
    selectedTab?: number;
    tabOneText: string;
    tabTwoText: string;
}

const Tabs = (props: IHeader) => {
    const [tab, setTab] = useState<number>(0);
    const {sizes, colors, fonts} = useTheme();

    useEffect(() => {
        if (props.selectedTab != undefined) {
            setTab(props.selectedTab);
        }
    }, [props.selectedTab]);

    const setTabChange = (filter: number) => {
        setTab(filter);
        props.callback(filter);
    };

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            paddingHorizontal: sizes.xxl,
            backgroundColor: colors.secondaryBackground,
            paddingBottom: sizes.s,
            paddingTop: sizes.sm,
        },
        active: {
            flex: 1,
            borderRadius: sizes.l,
            paddingVertical: sizes.s,
            backgroundColor: colors.tabBackground,
        },
        passive: {
            flex: 1,
            borderRadius: sizes.l,
            paddingVertical: sizes.s,
            backgroundColor: colors.secondaryBackground,
            shadowColor: colors.shadow,
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.1,
            shadowRadius: sizes.shadowRadius,
            borderWidth:0.5,borderColor:colors.cardBorder
        },
        text: {
            textAlign: 'center',
            fontSize: sizes.h3,
            fontFamily: fonts.text,
            color: colors.text
        }
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setTabChange(0)} style={tab === 0 ? styles.active : styles.passive}>
                <Text style={styles.text}>
                    {props.tabOneText}
                </Text>
            </TouchableOpacity>
            <Block
                color={colors.light}
                flex={0}
                width={0.5}
                marginTop={sizes.xs}
                marginHorizontal={sizes.m}
                height={sizes.socialIconSize}
            />
            <TouchableOpacity onPress={() => setTabChange(1)} style={tab === 1 ? styles.active : styles.passive}>
                <Text style={styles.text}>
                    {props.tabTwoText}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
export default React.memo(Tabs);

