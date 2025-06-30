import React, {useEffect, useRef, useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View, Animated, LayoutChangeEvent} from "react-native";
import {useTheme} from "../hooks";

export interface IHeader {
    callback: (tabNumber: number) => void;
    selectedTab?: number;
    tabOneText: string;
    tabTwoText: string;
}

const Tabs = (props: IHeader) => {
    const [tab, setTab] = useState<number>(0);
    const {sizes, colors, fonts} = useTheme();
    const animation = useRef(new Animated.Value(0)).current;
    const [containerWidth, setContainerWidth] = useState<number>(0);

    useEffect(() => {
        if (props.selectedTab !== undefined) {
            setTab(props.selectedTab);
            animate(props.selectedTab);
        }
    }, [props.selectedTab]);

    const animate = (index: number) => {
        const tabWidth = containerWidth / 2;
        Animated.timing(animation, {
            toValue: index * tabWidth,
            duration: 250,
            useNativeDriver: false
        }).start();
    };

    const setTabChange = (index: number) => {
        setTab(index);
        animate(index);
        props.callback(index);
    };

    const onLayout = (e: LayoutChangeEvent) => {
        setContainerWidth(e.nativeEvent.layout.width);
    };

    const styles = StyleSheet.create({
        container: {
            backgroundColor:colors.secondaryBackground,
            elevation:3,
            shadowColor: colors.shadow,
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.2,
            shadowRadius: sizes.shadowRadius,
            flexDirection: 'row',
            marginTop: sizes.s,
            marginBottom: sizes.s,
            marginHorizontal: sizes.xl,
            borderRadius: sizes.l,
            height: sizes.xl,
        },
        switch: {
            position: 'absolute',
            top: 4,
            bottom: 4,
            left: 4,
            width: containerWidth / 2 - 8,
            backgroundColor: colors.mediumGray,
            borderRadius: sizes.m,
        },
        tab: {
            padding:sizes.s,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
        },
        text: {
            fontSize: sizes.h4,
            fontFamily: fonts.text,
            color: colors.text,
        },
        activeText: {
            fontFamily: fonts.semibold,
        },
    });

    return (
        <View style={styles.container} onLayout={onLayout}>
            {containerWidth > 0 && (
                <Animated.View style={[styles.switch, {transform: [{translateX: animation}]}]}/>
            )}
            <TouchableOpacity style={styles.tab} onPress={() => setTabChange(0)}>
                <Text style={[styles.text, tab === 0 && styles.activeText]}>
                    {props.tabOneText}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab} onPress={() => setTabChange(1)}>
                <Text style={[styles.text, tab === 1 && styles.activeText]}>
                    {props.tabTwoText}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default Tabs;
