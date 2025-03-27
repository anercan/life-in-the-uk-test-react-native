import React, {useCallback, useContext, useState} from 'react';
import {
    Dimensions,
    Platform,
    ScrollView,
    TouchableOpacity,
    View
} from 'react-native';

import {AppText, Block, Image} from '../components/';
import {useData, useTheme} from '../hooks/';
import {TitleContext} from "context/TitleContext";
import {useFocusEffect} from "@react-navigation/native";
import {isPremium} from "util/jwtUtil";
import useApiCaller from "../hooks/useApiCaller";
import {capitalizeWords, checkReviewModalShown, getShortenText, hexWithOpacity} from "util/commonUtil";
import {ContributionGraph, PieChart} from "react-native-chart-kit";
//import {Instagram} from 'react-content-loader/native'
import * as StoreReview from 'react-native-store-review';
import analytics from "@react-native-firebase/analytics";

const isAndroid = Platform.OS === 'android';

const {height, width} = Dimensions.get('window');

const Profile = ({navigation}) => {
    const {isDark} = useData();
    const {apiCaller, loading} = useApiCaller(navigation);
    const {sizes, colors} = useTheme();
    const [userData, setUserData] = useState<UserDataResponse>();
    const [isPremiumUser, setIsPremiumUser] = useState(false);
    const [incorrectMap, setIncorrectMap] = useState<IncorrectData[]>([]);
    const [activityData, setActivityData] = useState<ActivityData[]>([]);
    const {setTitle} = useContext(TitleContext);

    useFocusEffect(
        useCallback(() => {
            setTitle('Profile');
            const checkPremiumStatus = async () => {
                const premium = await isPremium();
                setIsPremiumUser(premium);
            };
            checkPremiumStatus();
            getUserInfo();
        }, [])
    )

    const handleReviewRequest = () => {
        try {
            checkReviewModalShown().then((reviewModalShownBefore: any) => {
                if (!reviewModalShownBefore) {
                    StoreReview.requestReview();
                }
            });
        } catch (e) {
            analytics().logEvent('warn-review-request');
        }
    };

    const getPremiumScreen = () => {
        navigation.navigate('GetPremiumScreen');
    }

    function getCount(data: ActivityData) {
        if (data?.count) {
            if (data.count == 0) {
                return 0;
            } else if (data.count > 0) {
                return 1;
            }
        }
        return 0;
    }

    const getUserInfo = () => {
        apiCaller('profile/get-user-info')
            .then((profileResponse: any) => {
                setUserData(profileResponse);
                if (profileResponse?.wrongsMap) {
                    let incorrectDataList: IncorrectData[] = [];
                    let wrongsMap = profileResponse.wrongsMap;

                    Object.entries(wrongsMap).forEach(([key, value], index) => {
                        incorrectDataList.push({
                            name: '- ' + getShortenText(capitalizeWords(key), 25),
                            incorrectCount: value,
                            color: getColor(index),
                            legendFontColor: colors.light,
                            legendFontSize: sizes.smallText
                        } as IncorrectData);
                    });

                    setIncorrectMap(incorrectDataList);
                }
                if (profileResponse?.activityDataList) {
                    let activityDataList: ActivityData[] = [];
                    profileResponse?.activityDataList.forEach((data: ActivityData) => {
                        activityDataList.push({
                            count: getCount(data),
                            date: data.date
                        } as ActivityData);
                    });
                    setActivityData(activityDataList)
                }
                if (profileResponse?.userOngoingQuizCount + profileResponse?.userSolvedQuizCount > 1) {
                    handleReviewRequest();
                }
            });
    }

    const getSubscribePremiumContent = () => {
        return (
            <View style={{flexDirection: 'column', marginHorizontal: sizes.s}}>
                <View style={{flex: 1, marginBottom: sizes.m}}>
                    <AppText h4 align={"center"}>Most Incorrect Answers by Subjects</AppText>
                    <View style={{
                        borderColor: '#6f6e6e',
                        paddingVertical: sizes.xs,
                        borderRadius: sizes.sm,
                        borderWidth: 1,
                        alignItems: 'center',
                    }}>

                        <TouchableOpacity onPress={() => getPremiumScreen()}>
                            <Image
                                resizeMode={"contain"}
                                width={width / 1.2}
                                height={height / 6}
                                source={isDark ? require('../assets/images/pie-chart-blur-dark.png') :require('../assets/images/pie-chart-blur.png')}
                            />
                        </TouchableOpacity>

                        <View style={{alignItems: 'center'}}>
                            <AppText onPress={() => getPremiumScreen()} style={{textDecorationLine: "underline"}}
                                     size={sizes.text}
                                     semibold
                                     color={colors.text}>Unlock with Premium+ Plan</AppText>
                        </View>
                    </View>
                </View>

                <View style={{flex: 1}}>
                    <AppText h4 align={"center"}>Activity (Last 3 Months)</AppText>
                    <View style={{
                        borderColor: '#6f6e6e',
                        paddingVertical: sizes.xs,
                        borderRadius: sizes.sm,
                        borderWidth: 1,
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity onPress={() => getPremiumScreen()}>
                            <Image
                                resizeMode={"contain"}
                                width={width / 1.2}
                                height={height / 5}
                                source={isDark ? require('../assets/images/contribution-blur-dark.png') : require('../assets/images/contribution-blur.png')}
                            />
                        </TouchableOpacity>
                        <View style={{alignItems: 'center'}}>
                            <AppText onPress={() => getPremiumScreen()} style={{textDecorationLine: "underline"}}
                                     size={sizes.text}
                                     semibold
                                     color={colors.text}>Unlock with Premium+ Plan</AppText>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    function getColor(index) {
        const colorList = ['#c26666', '#82cdb9', '#deba86', '#7ea36d',
            '#a97ab8', '#a7953b', '#529aac', '#45518d', '#2d606c', '#2d606c'];
        return colorList[index];
    }

    const getTopicStatistics = () => {
        return (
            <View style={{flex: 1, marginBottom: sizes.m}}>
                <AppText h4 align={"center"}>Most Incorrect Answers by Subjects</AppText>
                <View style={{
                    borderColor: '#6f6e6e',
                    paddingVertical: sizes.xs,
                    borderRadius: sizes.sm,
                    borderWidth: 1,
                    alignItems: 'center',
                }}>
                    <PieChart
                        data={incorrectMap}
                        width={width / 1.1}
                        height={height / 6}
                        chartConfig={{
                            color: (opacity = 1) => hexWithOpacity(colors.text,opacity),
                        }}
                        accessor={"incorrectCount"}
                        backgroundColor={"transparent"}
                        center={[sizes.xl, -sizes.xs]}
                        absolute
                        paddingLeft={-sizes.xxl + ""}
                    />
                </View>
            </View>);
    }

    const getActivityData = () => {
        return (
            <View style={{flex: 1}}>
                <AppText h4 align={"center"}>Activity (Last 3 Months)</AppText>
                <View style={{
                    borderColor: '#6f6e6e',
                    paddingVertical: sizes.xs,
                    borderRadius: sizes.sm,
                    borderWidth: 1,
                    alignItems: 'center',
                }}>
                    <ContributionGraph
                        values={activityData}
                        endDate={new Date()}
                        numDays={90}
                        accessor={"count"}
                        squareSize={height / 45}
                        width={width / 1.2}
                        height={height / 4.3}
                        chartConfig={{
                            backgroundGradientFrom: colors.secondaryBackground.toString(),
                            backgroundGradientTo: colors.secondaryBackground.toString(),
                            color: (opacity = 1) => hexWithOpacity(colors.primary, opacity),
                            labelColor: (opacity = 1) => hexWithOpacity(colors.text, opacity),
                        }}
                        tooltipDataAttrs={() => {
                            return {rx: 8, ry: 8};
                        }}
                    />
                </View>
            </View>
        );
    }

    const getUserStatistics = () => {
        if (userData != null && userData.wrongsMap != null && Object.keys(userData.wrongsMap).length) {
            return (
                <View style={{flexDirection: 'column', marginHorizontal: sizes.s}}>
                    {incorrectMap?.length > 0 &&
                        getTopicStatistics()
                    }
                    {getActivityData()}
                </View>)
        }
        return <></>
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
                {!loading ?
                    <>
                        {/* Profile Image and Stats */}
                        <View style={{marginHorizontal: sizes.xs}}>
                            <Image
                                background
                                resizeMode="cover"
                                padding={sizes.sm}
                                paddingBottom={sizes.l}
                                radius={sizes.cardRadius}
                                shadow={true}
                                source={require('../assets/images/img.png')}
                            >
                                {userData?.avatarUrl &&
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
                                style={{elevation: 2}}
                                shadow={!isAndroid}
                                marginTop={-sizes.l}
                                marginHorizontal="8%"
                                color="rgba(255,255,255,0.2)"
                            >

                                <Block
                                    row
                                    flex={0}
                                    radius={sizes.sm}
                                    color={colors.orderBoxBackGround}
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

                        {isPremiumUser ?
                            <View style={{marginTop: sizes.m}}>
                                {getUserStatistics()}
                            </View>
                            :
                            <View style={{marginTop: sizes.m}}>
                                {getSubscribePremiumContent()}
                            </View>
                        }

                        {/* Logout Button */}
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            marginTop: '15%',
                            marginBottom: sizes.s
                        }}>
                        </View>

                    </>
                    :null
                    //<Instagram backgroundColor={colors.tabBackground.toString()} style={{marginLeft: sizes.sm}}/>
                }
            </View>
        </ScrollView>
    );
};

export interface ActivityData {
    count: number,
    date: string
}

interface UserDataResponse {
    userSolvedQuizCount: number;
    userOngoingQuizCount: number;
    totalQuizCount: number;
    avatarUrl: string;
    wrongsMap: Record<string, number>;
    activityDataList: ActivityData[];
}

export interface IncorrectData {
    name: string,
    incorrectCount: number,
    color: string,
    legendFontColor: string,
    legendFontSize: number
}

export default Profile;
