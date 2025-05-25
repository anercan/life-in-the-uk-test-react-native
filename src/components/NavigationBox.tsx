import React, {useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {useTheme} from '../hooks';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const {width} = Dimensions.get('window');

const NavigationBox = ({header, icon, onPress}) => {
    const {fonts, sizes, colors} = useTheme();
    const styles = useMemo(() => StyleSheet.create({
        container: {
            margin: sizes.s,
        },
        card: {
            width: width / 2.5,
            height: width / 3,
            backgroundColor: colors.card,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: sizes.sm,
            paddingBottom: sizes.s,
            paddingTop: sizes.sm,
            borderRadius: sizes.sm,
            shadowColor: colors.shadow,
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.2,
            shadowRadius: sizes.shadowRadius,
            elevation: 4,
        },
        textContainer: {
            flex: 1,
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
        },
        header: {
            fontFamily: fonts.medium,
            fontSize: sizes.smallText,
            color: colors.text,
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
    }), []);

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
                        <Text style={styles.header}>{header}</Text>
                    </View>
                </View>


            </View>
        </TouchableOpacity>
    );
};

export default NavigationBox;
