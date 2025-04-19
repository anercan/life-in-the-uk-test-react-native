import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {useTheme} from "hooks";
import * as Progress from 'react-native-progress';

const {width} = Dimensions.get('window');

const ProgressBar = ({progress}) => {
    const {sizes, colors} = useTheme();

    const styles = StyleSheet.create({
        progressBar: {
            paddingTop: sizes.sm,
        }, customProgressBar: {
            borderRadius: 7
        }
    });

    return (
        <View style={styles.progressBar}>
            <Progress.Bar height={sizes.sm} borderColor={String(colors.dark)} color={String(colors.primary)}
                          style={styles.customProgressBar}
                          progress={progress || 0}
                          width={width / 1.12}/>
        </View>
    );
};

export default ProgressBar;
