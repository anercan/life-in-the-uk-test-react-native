import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from "hooks";
import * as Progress from 'react-native-progress';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const {width} = Dimensions.get('window');

const ProgressBar = ({isCurrentInFav,questionId, progress,favOperation}) => {
    const {sizes, colors} = useTheme();
    const [isFav, setFav] = useState(isCurrentInFav);

    useEffect(() => {
        setFav(isCurrentInFav);
    }, [isCurrentInFav]);

    const styles = StyleSheet.create({
        progressBar: {
            zIndex:1,
            flexDirection: 'row',
            paddingVertical: sizes.xs,
            paddingHorizontal: sizes.s,
            backgroundColor: colors.card,
            elevation: 5,
            shadowColor: colors.shadow,
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.2,
            shadowRadius: sizes.shadowRadius,
        }, customProgressBar: {}
    });

    const onPressFav = () => {
        const isAddOperation = !isFav;
        setFav(prevState => !prevState);
        favOperation(questionId,isAddOperation);
    }

    return (
        <View style={styles.progressBar}>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',}}>
            </View>
            <View style={{
                alignItems: 'center', justifyContent: 'center',
                flex: 7,
            }}>
                <Progress.Bar height={sizes.sm} borderColor={String(colors.card)}
                              color={String(colors.secondary)}
                              style={styles.customProgressBar}
                              borderRadius={sizes.s}
                              width={width / 1.4}
                              unfilledColor={String('#aeb2b8')}
                              progress={progress || 0}
                />

            </View>
            <TouchableOpacity onPress={() => onPressFav()} style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <MaterialCommunityIcons name={isFav ? 'heart' : 'heart-outline'}
                                        color={isFav ? colors.secondary : colors.light} size={sizes.md}/>
            </TouchableOpacity>

        </View>
    );
};

export default ProgressBar;
