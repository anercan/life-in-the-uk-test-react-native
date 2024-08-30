import {AppText, Block, Button, Input} from "./index";
import {Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {useTheme} from "../hooks";

export interface IHeader {
    callback: (tabNumber: number) => void;
    title: String;
    hideSearch?: boolean;
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

    return (
        <>
            <View style={{paddingTop: props.hideSearch ? 42 : null, paddingBottom: 10}}>
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
                marginTop={0}
                marginBottom={-10}
                justify="center"
            >
                <Button>
                    <Block row align="center">
                        <AppText onPress={() => setTabChange(0)} p font={fonts?.[tab === 0 ? 'medium' : 'normal']}>
                            {props.tabOneText}
                        </AppText>
                    </Block>
                </Button>
                <Block
                    gray
                    flex={0}
                    width={1}
                    marginHorizontal={sizes.sm}
                    height={sizes.socialIconSize}
                />
                <Button>
                    <Block row align="center">
                        <AppText onPress={() => setTabChange(1)} p font={fonts?.[tab === 1 ? 'medium' : 'normal']}>
                            {props.tabTwoText}
                        </AppText>
                    </Block>
                </Button>
            </Block>
        </>
    );
}
export default Tabs;

