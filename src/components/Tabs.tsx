import {AppText, Block, Button, Input} from "./index";
import {StyleSheet, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {useTheme} from "../hooks";

export interface IHeader {
    callback: (tabNumber: number) => void;
    title: String;
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
            borderRadius: 15,
            paddingVertical: 8,
            paddingHorizontal:0,
            backgroundColor: '#e0dede',
            alignItems: 'center',
            justifyContent: 'center',
            textDecorationLine: 'underline',

        },
        passive: {
            borderRadius: 25,
            paddingVertical: 10,
            paddingHorizontal:0,
            backgroundColor: '#f3f2f2',
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
    return (
        <View style={{marginTop: 15,marginBottom: 10}}>
            <View>
                <Text style={{
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                    fontSize: 20,
                    color: '#283130'
                }}> {props.title} </Text>
            </View>

            <Block
                row
                flex={0}
                align="center"
                marginTop={20}
                marginBottom={-10}
                marginHorizontal={60}
                justify="center"
            >
                <Block align="center" style={tab === 0 ? styles.active : styles.passive}>
                    <AppText margin={0} padding={0} onPress={() => setTabChange(0)} p font={fonts?.[tab === 0 ? 'medium' : 'medium']}>
                        {props.tabOneText}
                    </AppText>
                </Block>
                <Block
                    gray
                    flex={0}
                    width={1}
                    marginHorizontal={15}
                    height={sizes.socialIconSize}
                    align="center"
                    justify="center"
                />
                <Block align="center" style={tab === 1 ? styles.active : styles.passive}>
                    <AppText onPress={() => setTabChange(1)} p font={fonts?.[tab === 1 ? 'medium' : 'medium']}>
                        {props.tabTwoText}
                    </AppText>
                </Block>
            </Block>
        </View>
    );
}
export default Tabs;

