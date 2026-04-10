import React from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {FadeInUp} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppText} from 'components/index';
import useTheme from '../hooks/useTheme';

const BENEFITS = [
    {icon: 'star-circle', text: 'Unlock 1000+ Premium Questions'},
    {icon: 'infinity', text: 'Limitless Personal Daily Challenges'},
    {icon: 'chart-line', text: 'Advanced Statistics & Analytics'},
    {icon: 'heart', text: 'Create Favorite Questions List'},
    {icon: 'account-group', text: 'Compare Results with Others'},
    {icon: 'shield-check', text: 'Cancel Anytime, No Commitment'},
];

const BenefitsList = () => {
    const {fonts, sizes} = useTheme();

    const styles = StyleSheet.create({
        benefitRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 8,
            paddingHorizontal: sizes.s,
        },
        benefitIconContainer: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: sizes.sm,
        },
        benefitText: {
            flex: 1,
            fontSize: sizes.smallText,
            color: '#FFFFFF',
            fontFamily: fonts.medium,
            textAlign: 'left',
        },
    });

    return (
        <>
            {BENEFITS.map((benefit, index) => (
                <Animated.View
                    key={benefit.text}
                    entering={FadeInUp.delay(index * 90).duration(500)}
                    style={styles.benefitRow}>
                    <View style={styles.benefitIconContainer}>
                        <Icon name={benefit.icon} size={20} color="#FFD700"/>
                    </View>
                    <AppText style={styles.benefitText}>{benefit.text}</AppText>
                </Animated.View>
            ))}
        </>
    );
};

export default React.memo(BenefitsList);

