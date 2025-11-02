import React, {useCallback, useContext, useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {AppText, Block, Image} from '../components/';
import {useTheme} from '../hooks/';
import {TitleContext} from "context/TitleContext";
import {useFocusEffect} from "@react-navigation/native";
import useApiCaller from "../hooks/useApiCaller";
import NavigationBox from "components/NavigationBox";
import ActivityModal from "components/ActivityModal";

const Profile = ({navigation}) => {
    const {apiCaller} = useApiCaller(navigation);
    const {sizes, colors} = useTheme();
    const [userData, setUserData] = useState<UserDataResponse>();
    const {setTitle} = useContext(TitleContext);
    const [modalVisible, setModalVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setTitle('Profile');
            getUserInfo();
        }, [])
    )

    const getUserInfo = () => {
        apiCaller('profile/get-user-info')
            .then((profileResponse: any) => {
                setUserData(profileResponse);
            });
    }

    return (
        <ScrollView>
            <View style={{
                flexDirection: 'column',
                marginTop: sizes.sm,
                marginBottom: sizes.s,
                marginHorizontal: sizes.s,
                flex: 1
            }}>
                {/* Profile Image and Stats */}
                <View style={{marginHorizontal: sizes.xs, marginBottom: sizes.m}}>
                    <Image
                        background
                        resizeMode="cover"
                        padding={sizes.sm}
                        paddingBottom={sizes.l}
                        radius={sizes.s}
                        shadow={true}
                        source={require('../assets/images/img.png')}
                    >
                        {
                            <Block flex={0} align="center">
                                <Image
                                    width={sizes.xxl}
                                    height={sizes.xxl}
                                    marginBottom={sizes.sm}
                                    source={{uri: userData?.avatarUrl}}
                                />
                            </Block>
                        }

                    </Image>

                    {/* Profile Stats */}
                    <Block
                        flex={0}
                        radius={sizes.sm}
                        marginTop={-sizes.l}
                        marginHorizontal="8%"
                        color="rgba(255,255,255,0.2)"
                        style={{
                            borderWidth: 0.5,
                            borderColor: "rgba(255,255,255,0.2)"
                        }}
                    >

                        <Block
                            row
                            flex={0}
                            radius={sizes.sm}
                            color={colors.card}
                            overflow="hidden"
                            justify="space-evenly"
                            paddingVertical={sizes.sm}
                            renderToHardwareTextureAndroid
                        >
                            <Block>
                                <TouchableOpacity style={{alignItems: 'center'}}
                                                  onPress={() => navigation.reset({
                                                      index: 0,
                                                      routes: [{name: 'QuizGroupListStack'}]
                                                  })}>
                                    <AppText size={sizes.p} semibold={true}
                                             p>{userData?.totalQuizCount}</AppText>
                                    <AppText>Total</AppText>
                                </TouchableOpacity>
                            </Block>
                            <Block>
                                <TouchableOpacity style={{alignItems: 'center'}}
                                                  onPress={() => navigation.navigate('SolvedQuizListScreens')}>
                                    <AppText size={sizes.p} semibold={true}
                                             p>{userData?.userOngoingQuizCount}</AppText>
                                    <AppText>Ongoing</AppText>
                                </TouchableOpacity>
                            </Block>
                            <Block>
                                <TouchableOpacity style={{alignItems: 'center'}}
                                                  onPress={() => navigation.navigate('SolvedQuizListScreens')}>
                                    <AppText size={sizes.p} semibold={true}
                                             p>{userData?.userSolvedQuizCount}</AppText>
                                    <AppText>Solved</AppText>
                                </TouchableOpacity>
                            </Block>
                        </Block>

                    </Block>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'center',}}>
                    <NavigationBox icon={'calendar-question'} header={'Daily Challenge'}
                                   onPress={() => navigation.navigate('QuizScreen', {
                                       quizType: 'DAILY',
                                       quizCardList: [],
                                   })}/>
                    <NavigationBox icon={'cards-heart-outline'} header={'Favorites'}
                                   onPress={() => navigation.navigate('QuizScreen', {
                                       quizType: 'FAVORITES',
                                       quizCardList: [],
                                   })}/>
                </View>
                <View key={2} style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <NavigationBox icon={'equalizer'} header={'Incorrect Distribution'}
                                   onPress={() => navigation.navigate('AnalyseScreen')}/>
                    <NavigationBox icon={'calendar-blank'} header={'Activity'}
                                   onPress={() => setModalVisible((prevState => !prevState))}/>
                </View>

            </View>
            <ActivityModal navigation={navigation} modalVisible={modalVisible}
                           onPressClose={() => setModalVisible((prevState => !prevState))}/>
        </ScrollView>
    );
};

export interface ActivityData {
    count: number,
    date: string
}

interface UserDataResponse {
    avatarUrl: string;
    userSolvedQuizCount: number;
    userOngoingQuizCount: number;
    totalQuizCount: number;
}

export default Profile;
