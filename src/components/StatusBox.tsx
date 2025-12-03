import React from 'react';
import {View, StyleSheet} from 'react-native';
import AppText from './AppText';
import {useTheme} from "hooks";

const StatusBox = ({text}) => {

    const {sizes, colors, fonts} = useTheme();

    const styles = StyleSheet.create({
        container: {
            marginHorizontal: sizes.sm,
            padding: sizes.sm,
            borderRadius: sizes.sm,
            marginTop: sizes.sm,
            alignItems: 'center',
        },
    });

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: colors.tabBackground},
            ]}
        >
            <AppText style={{fontSize: sizes.text, fontFamily: fonts.semibold}}>
                {text}
            </AppText>
        </View>
    );
};

export default React.memo(StatusBox);
