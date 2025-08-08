import React from 'react';
import {View, StyleSheet} from 'react-native';
import AppText from './AppText';
import {useTheme} from "hooks";


const StatusBox = ({text}) => {

    const {sizes,colors} = useTheme();

    const styles = StyleSheet.create({
        container: {
            marginHorizontal:sizes.sm,
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
            <AppText
                h3
                align="center"
                color={colors.text}
            >
                {text}
            </AppText>
        </View>
    );
};

export default React.memo(StatusBox);
