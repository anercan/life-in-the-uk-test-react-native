import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Platform, Text, View} from 'react-native';

import {Block, Image, AppText, Button} from '../components/';
import {useTheme} from '../hooks/';
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import apiCaller from "../config/apiCaller";
import {AuthContext} from "../context/AuthContext";
import {TitleContext} from "../context/TitleContext";
import {useFocusEffect} from "@react-navigation/native";

const isAndroid = Platform.OS === 'android';

const Profile = ({navigation}) => {
    const {sizes} = useTheme();
    const [userData, setUserData] = useState();
    const { logout } = useContext(AuthContext);
    const { setTitle } = useContext(TitleContext);

    useFocusEffect(
        useCallback(() => {
            setTitle('My Profile');
            apiCaller('profile/get-user-info')
                .then((profileResponse:any) => {
                    setUserData(profileResponse)
                });
        }, [])
    )

    const logoutInternal = async () => {
        logout()
        GoogleSignin.signOut();
    }

    const getPremiumScreen = () => {
        navigation.navigate('GetPremiumScreen');
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
                        source={require('../../assets/img.png')}
                    >
                        <Block flex={0} align="center">
                            <Image
                                width={64}
                                height={64}
                                marginBottom={sizes.sm}
                                source={{uri: userData?.avatarUrl}}
                            />
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
                            flex={0}
                            radius={sizes.sm}
                            color={'#dbdbdb'}
                            overflow="hidden"
                            justify="space-evenly"
                            paddingVertical={sizes.sm}
                            renderToHardwareTextureAndroid>
                            <Block align="center">
                                <AppText h5>{userData?.totalQuizCount}</AppText>
                                <AppText>Total</AppText>
                            </Block>
                            <Block align="center">
                                <AppText h5>{userData?.userOngoingQuizCount}</AppText>
                                <AppText>Ongoing</AppText>
                            </Block>
                            <Block align="center">
                                <AppText h5>{userData?.userSolvedQuizCount}</AppText>
                                <AppText>Solved</AppText>
                            </Block>
                        </Block>
                    </Block>
                </Block>
                <View style={{alignItems:'center',justifyContent:'center',marginTop:50}}>
                    <Button width={100} color={'#666666'} onPress={() => getPremiumScreen()} ><Text style={{color:'#ffffff'}}>Get Premium</Text></Button>
                </View>
                <View style={{alignItems:'center',justifyContent:'center', marginTop:300}}>
                    <Button width={100} color={'#666666'}  onPress={() => logoutInternal()} ><Text style={{color:'#ffffff'}}>Logout</Text></Button>
                </View>
            </Block>
        </Block>
    );
};

export default Profile;
