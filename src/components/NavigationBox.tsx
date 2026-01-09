import React from 'react';
import {View, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {useTheme} from '../hooks';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {AppText} from "components/index";

const {width} = Dimensions.get('window');

const NavigationBox = ({header, icon, onPress}) => {
    const {fonts, sizes, colors} = useTheme();
    const styles = StyleSheet.create({
        container: {
            margin: sizes.s,
        },
        card: {
            width: width / 2.5,
            height: width / 3,
            elevation:1,
            backgroundColor: colors.card,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: sizes.sm,
            paddingBottom: sizes.s,
            paddingTop: sizes.sm,
            borderRadius: sizes.sm,
            borderBottomRightRadius: sizes.l,
            borderWidth:1,
            borderColor:colors.cardBorder,
        },
        textContainer: {
            flex: 1,
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
        },
        header: {
            textAlign:'auto',
            fontFamily: fonts.medium,
            fontSize: sizes.smallText,
            marginBottom: sizes.s,
        },
        iconOutline: {
            width: sizes.l,
            height: sizes.l,
            borderRadius: sizes.s,
            backgroundColor: colors.secondary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconContainer: {
            flexDirection: 'row',
            flex: 2
        }
    });

    return (
        <TouchableOpacity
            id={header}
            style={styles.container}
            onPress={() => onPress()}
            activeOpacity={0.85}
        >
            <View style={styles.card}>
                <View style={styles.iconContainer}>
                    <View style={{flex: 1}}>
                        <View style={styles.iconOutline}>
                            <MaterialCommunityIcons name={icon} color={colors.white} size={sizes.m}/>
                        </View>
                    </View>
                </View>
                <View style={{flexDirection: 'row', flex: 3}}>
                    <View style={styles.textContainer}>
                        <AppText style={styles.header}>{header}</AppText>
                    </View>
                </View>


            </View>
        </TouchableOpacity>
    );
};

export default NavigationBox;
