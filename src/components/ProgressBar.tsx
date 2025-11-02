import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from "hooks";
import * as Progress from 'react-native-progress';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const {width} = Dimensions.get('window');

const ProgressBar = ({isCurrentInFav, questionId, progress, favOperation, isMuted, setPlaySound}) => {
    const {sizes, colors} = useTheme();
    const [isFav, setFav] = useState(isCurrentInFav);

    useEffect(() => {
        setFav(isCurrentInFav);
    }, [questionId]);

    const styles = StyleSheet.create({
        progressBar: {
            borderWidth: 0.8,
            borderColor: colors.cardBorder,
            flexDirection: 'row',
            paddingHorizontal: sizes.s,
            backgroundColor: colors.card,
            alignItems: "center",
            flex: 1
        },
        customProgressBar: {alignSelf: "center"}
    });

    const onPressFav = () => {
        const isAddOperation = !isFav;
        setFav(prevState => !prevState);
        favOperation(questionId, isAddOperation);
    }

    const onPressSound = () => {
        setPlaySound();
    }

    return (
        <View style={styles.progressBar}>
            <TouchableOpacity onPress={() => onPressSound()} style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <MaterialCommunityIcons name={isMuted ? 'volume-off' : 'volume-high'}
                                        color={isMuted ? colors.light : colors.primary} size={sizes.md}/>
            </TouchableOpacity>

            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 6,
            }}>
                <Progress.Bar height={sizes.sm} borderColor={String(colors.card)}
                              color={String(colors.dark)}
                              style={styles.customProgressBar}
                              borderRadius={sizes.s}
                              width={width / 1.5}
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
                                        color={colors.secondary}
                                        size={sizes.md}
                />
            </TouchableOpacity>

        </View>
    );
};

export default ProgressBar;
