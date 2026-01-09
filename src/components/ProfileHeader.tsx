import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Image, Block} from '../components';
import AppText from '../components/AppText';
import {useTheme} from "hooks";

const ProfileHeader = ({userData, navigation}) => {

    const {sizes, colors, fonts} = useTheme();

    return (
        <View style={{marginHorizontal: sizes.xs, marginBottom: sizes.m}}>
            <Image background
                   borderRadius={sizes.s}
                style={{
                    padding: sizes.sm,
                    borderRadius: sizes.sm,
                }}
                source={require('../assets/images/img.png')}
            >
                <Block flex={0} align="center">
                    <Image
                        style={{width: sizes.xxl, height: sizes.xxl, borderRadius: sizes.m,marginBottom: sizes.md,borderWidth:2,borderColor:colors.white}}
                        source={{uri: userData?.avatarUrl}}
                    />
                </Block>
            </Image>

            <Block
                shadow={true}
                flex={0}
                radius={sizes.sm}
                color={colors.card}
                style={{
                    marginTop: -sizes.l,
                    marginHorizontal: "8%",
                    borderWidth: 0.5,
                    borderColor: 'rgba(255,255,255,0.2)',
                }}
            >
                <Block
                    row
                    flex={0}
                    radius={sizes.sm}
                    color={colors.card}
                    overflow="hidden"
                    justify="space-evenly"
                    style={{
                        paddingVertical: sizes.sm,
                    }}
                    renderToHardwareTextureAndroid
                >
                    <Block>
                        <TouchableOpacity
                            style={{alignItems: 'center'}}
                            onPress={() =>
                                navigation.reset({
                                    index: 0,
                                    routes: [{name: 'QuizGroupListStack'}],
                                })
                            }
                        >
                            <AppText style={{fontFamily: fonts.medium}}>
                                {userData?.totalQuizCount}
                            </AppText>
                            <AppText>Total</AppText>
                        </TouchableOpacity>
                    </Block>

                    <Block>
                        <TouchableOpacity
                            style={{alignItems: 'center'}}
                            onPress={() => navigation.navigate('SolvedQuizListScreens')}
                        >
                            <AppText style={{fontFamily: fonts.medium}}>
                                {userData?.userOngoingQuizCount}
                            </AppText>
                            <AppText>Ongoing</AppText>
                        </TouchableOpacity>
                    </Block>

                    <Block>
                        <TouchableOpacity
                            style={{alignItems: 'center'}}
                            onPress={() => navigation.navigate('SolvedQuizListScreens')}
                        >
                            <AppText style={{fontFamily: fonts.medium}}>
                                {userData?.userSolvedQuizCount}
                            </AppText>
                            <AppText>Solved</AppText>
                        </TouchableOpacity>
                    </Block>
                </Block>
            </Block>
        </View>
    );
};

export default ProfileHeader;
