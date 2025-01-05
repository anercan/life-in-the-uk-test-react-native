import {AppText, Block, Button, Input} from "./index";
import {StyleSheet, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {useTheme} from "../hooks";

export interface IHeader {
    callback: (tabNumber: number) => void;
    selectedTab?: number;
    tabOneText: string;
    tabTwoText: string;
}

const Tabs = (props: IHeader) => {
    const [tab, setTab] = useState<number>(0);
    const {fonts, sizes} = useTheme();

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
        active: {
            borderRadius: sizes.m,
            paddingVertical: sizes.s,
            backgroundColor: '#c7c7c7',
        },
        passive: {
            paddingVertical: sizes.s,
            backgroundColor: '#e5e5e5',
        },
    });
    return (
            <Block
                row
                marginTop={sizes.sm}
                marginHorizontal={sizes.xxl}
                align={"center"}
            >
                <Block align="center" style={tab === 0 ? styles.active : styles.passive}>
                    <AppText onPress={() => setTabChange(0)} size={sizes.h3} >
                        {props.tabOneText}
                    </AppText>
                </Block>
                <Block
                    gray
                    flex={0}
                    width={1}
                    marginTop={sizes.xs}
                    marginHorizontal={sizes.m}
                    height={sizes.socialIconSize}
                />
                <Block align="center" style={tab === 1 ? styles.active : styles.passive}>
                    <AppText onPress={() => setTabChange(1)} size={sizes.h3}>
                        {props.tabTwoText}
                    </AppText>
                </Block>
            </Block>
    );
}
export default Tabs;

