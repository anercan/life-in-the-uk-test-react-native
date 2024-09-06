import React, {useCallback} from 'react';
import {Platform, Linking} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';

import {Block, Button, Image, AppText} from '../components/';
import {useData, useTheme} from '../hooks/';
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ButtonCard} from "../components";

const isAndroid = Platform.OS === 'android';

const Profile = ({navigation}) => {
    const {user} = useData();
    const {assets, colors, sizes} = useTheme();

    const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
    const IMAGE_VERTICAL_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;

    const logout = async () => {
        await GoogleSignin.signOut();
        await AsyncStorage.removeItem('authToken');
        navigation.navigate('LoginScreen');
    }

    return (
        <Block safe marginTop={sizes.md}>
            <Block
                scroll
                paddingHorizontal={sizes.s}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: sizes.padding}}>
                <Block flex={0}>
                    <Image
                        background
                        resizeMode="cover"
                        padding={sizes.sm}
                        paddingBottom={sizes.l}
                        radius={sizes.cardRadius}
                    >
                        <Button
                            row
                            flex={0}
                            justify="flex-start"
                            onPress={() => navigation.goBack()}>
                            <Image
                                radius={0}
                                width={10}
                                height={18}
                                color={colors.white}
                                source={assets.arrow}
                                transform={[{rotate: '180deg'}]}
                            />
                            <AppText p white marginLeft={sizes.s}>
                                {'profile.title'}
                            </AppText>
                        </Button>
                        <Block flex={0} align="center">
                            <Image
                                width={64}
                                height={64}
                                marginBottom={sizes.sm}
                                source={{uri: user?.avatar}}
                            />
                            <AppText h5 center white>
                                {user?.name}
                            </AppText>
                            <AppText p center white>
                                Sa
                            </AppText>
                        </Block>
                    </Image>

                    {/* profile: stats */}
                    <Block
                        flex={0}
                        radius={sizes.sm}
                        shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
                        marginTop={-sizes.l}
                        marginHorizontal="8%"
                        color="rgba(255,255,255,0.2)">
                        <Block
                            row
                            blur
                            flex={0}
                            intensity={100}
                            radius={sizes.sm}
                            overflow="hidden"
                            tint={colors.blurTint}
                            justify="space-evenly"
                            paddingVertical={sizes.sm}
                            renderToHardwareTextureAndroid>
                            <Block align="center">
                                <AppText h5>120</AppText>
                                <AppText>Solved</AppText>
                            </Block>
                            <Block align="center">
                                <AppText h5>100</AppText>
                                <AppText>Correct</AppText>
                            </Block>
                            <Block align="center">
                                <AppText h5>20</AppText>
                                <AppText>Wrong</AppText>
                            </Block>
                        </Block>
                    </Block>

                    <ButtonCard buttonText={'logout'} onPress={() => logout()}>

                    </ButtonCard>

                </Block>
            </Block>
        </Block>
    );
};

export default Profile;
