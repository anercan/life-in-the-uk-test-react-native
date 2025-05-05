import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {useTheme} from "hooks";
import * as Progress from 'react-native-progress';

const {width} = Dimensions.get('window');

const ProgressBar = ({progress}) => {
    const {sizes, colors} = useTheme();

    const styles = StyleSheet.create({
        progressBar: {
            paddingVertical: sizes.sm,
        }, customProgressBar: {
            borderRadius: sizes.sm
        }
    });

    return (
        <View style={styles.progressBar}>
            <Progress.Bar height={sizes.s} borderColor={String(colors.tabBackground)} color={String(colors.dark)}
                          style={styles.customProgressBar}
                          progress={progress || 0}
                          width={width / 1.12}/>
        </View>
    );
};

export default ProgressBar;
