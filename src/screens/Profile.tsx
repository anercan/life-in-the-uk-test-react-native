import React, {useCallback, useContext, useState} from 'react';
import {Dimensions, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {AppText, Block, Button, Image} from '../components/';
import {useTheme} from '../hooks/';
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {AuthContext} from "../context/AuthContext";
import {TitleContext} from "../context/TitleContext";
import {useFocusEffect} from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {isPremium} from "../util/jwtUtil";
import useApiCaller from "../hooks/useApiCaller";
import {getShortenText} from "../util/CommonUtil";
import {ContributionGraph, PieChart} from "react-native-chart-kit";
import ProfileLoader from "../components/ProfileLoader";

const isAndroid = Platform.OS === 'android';

const {height, width} = Dimensions.get('window');

export interface IncorrectData {
    name: string,
    incorrectCount: number,
    color: string,
    legendFontColor: string,
    legendFontSize: number
}

const Profile = ({navigation}) => {
    const {apiCaller} = useApiCaller();
    const {fonts, sizes, colors} = useTheme();
    const [userData, setUserData] = useState();
    const [isPremiumUser, setIsPremiumUser] = useState(false);
    const [incorrectMap, setIncorrectMap] = useState<IncorrectData[]>([]);  // Array of IncorrectData objects
    const [activityData, setActivityData] = useState<ActivityData[]>([]);  // Array of IncorrectData objects
    const {logout} = useContext(AuthContext);
    const {setTitle} = useContext(TitleContext);
    const [showLoader, setShowLoader] = useState(true);

    useFocusEffect(
        useCallback(() => {
            setTitle('My Profile');
            const checkPremiumStatus = async () => {
                const premium = await isPremium();
                setIsPremiumUser(premium);
            };
            checkPremiumStatus();
            getUserInfo();
        }, [])
    )

    const logoutInternal = async () => {
        logout();
        GoogleSignin.signOut();
    }

    const getPremiumScreen = () => {
        navigation.navigate('GetPremiumScreen');
    }

    function getCount(data) {
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
                setShowLoader(false);
                setUserData(profileResponse);
                if (profileResponse?.wrongsMap) {
                    let incorrectDataList: IncorrectData[] = [];
                    let wrongsMap = profileResponse.wrongsMap;

                    Object.entries(wrongsMap).forEach(([key, value], index) => {
                        incorrectDataList.push({
                            name: getShortenText(capitalizeWords(key), 25),
                            incorrectCount: value,
                            color: getColor(index),
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        } as IncorrectData);
                    });

                    setIncorrectMap(incorrectDataList);
                }
                if (profileResponse?.activityDataList) {
                    let activityDataList: ActivityData[] = [];
                    profileResponse?.activityDataList.forEach((data) => {
                        activityDataList.push({
                            count: getCount(data),
                            date: data.date
                        } as ActivityData);
                    });
                    setActivityData(activityDataList)
                }
            });
    }

    const styles = StyleSheet.create({
        upgradeButton: {
            borderRadius: sizes.sm,
            marginTop: sizes.md
        },
        featureText: {
            marginVertical: sizes.s,
            fontSize: sizes.h3,
            textAlign: 'center',
            fontFamily: fonts.thin,
            color: '#ffffff'
        }
    });

    const premiumFeatures = [
        'Access to Premium+ questions',
        'Get detailed statical data',
        'Compare your test results with others',
        'Early access to new features',
        'Activity reports'
    ];

    const renderFeature = (item: any) => (
        <>
            <Text style={styles.featureText}>• {item}</Text>
        </>
    );

    const getSubscribePremiumContent = () => {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => getPremiumScreen()}>
                <View style={{
                    backgroundColor: '#656464',
                    borderRadius: sizes.m,
                    padding: sizes.s,
                    elevation: 4,
                    marginBottom: sizes.xl,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    flex: 1
                }}>
                    <View style={{
                        backgroundColor: '#767474',
                        borderRadius: sizes.sm,
                        elevation: 4,
                        width: sizes.xl,
                        height: sizes.xl,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: -sizes.m,
                    }}>
                        <MaterialCommunityIcons name="lock" color={'#afadad'} size={sizes.m}/>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                        {premiumFeatures.map(feature => renderFeature(feature))}
                    </View>
                    <View style={{justifyContent: 'flex-end', marginBottom: sizes.s, flex: 3, alignItems: 'center'}}>
                        <Button style={styles.upgradeButton} shadow={true}
                                height={'60%'}
                                width={sizes.base * 20} color={'#2c2f3d'}
                                onPress={() => getPremiumScreen()}>
                            <AppText text color={'#ffffff'}>Get Premium+</AppText>
                        </Button>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    function getColor(index) {
        const colorList = ['#c46666', '#82cdb9', '#deba86', '#7ea36d',
            '#a97ab8', '#a39030', '#4a97aa', '#36458e', '#2d606c', '#2d606c'];
        return colorList[index];
    }

    function capitalizeWords(str) {
        return str
            .split(' ') // Split the string into an array of words
            .map((word) => {
                if (word === 'and' || word === 'And') {
                    return word;
                }
                return word.charAt(0).toUpperCase() + word.slice(1)
            }) // Capitalize each word
            .join(' '); // Join the words back into a single string
    }

    const getUserStatistics = () => {
        if (userData != null && userData.wrongsMap != null && Object.keys(userData.wrongsMap).length) {
            return (
                <View style={{flexDirection: 'column', marginHorizontal: sizes.s}}>
                    {incorrectMap?.length > 0 &&
                        <View style={{flex: 1, marginBottom: sizes.m}}>
                            <AppText h4 align={"center"}>Most Incorrect Answers by Subjects</AppText>
                            <View style={{
                                borderColor: colors.primary,
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
                                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    }}
                                    accessor={"incorrectCount"}
                                    backgroundColor={"transparent"}
                                    center={[sizes.xl, -sizes.xs]}
                                    absolute
                                    paddingLeft={-sizes.xxl + ""}
                                />
                            </View>
                        </View>
                    }
                    <View style={{flex: 1}}>
                        <AppText h4 align={"center"}>Activity (Last 3 Months)</AppText>
                        <View style={{
                            borderColor: colors.primary,
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
                                    backgroundGradientFrom: "#e5e5e5",
                                    backgroundGradientTo: "#e5e5e5",
                                    color: (opacity = 1) => `rgba(30, 110, 180, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(30, 30, 30, ${opacity})`,
                                }}
                                tooltipDataAttrs={(value) => {
                                    return {rx:8,ry:8};
                                }}
                            />
                        </View>
                    </View>
                </View>)
        }
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
                {!showLoader ?
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
                                source={require('../../assets/img.png')}
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
                                <TouchableOpacity activeOpacity={0.9}
                                                  onPress={() => navigation.navigate('SolvedQuizListScreens')}>
                                    <Block
                                        row
                                        flex={0}
                                        radius={sizes.sm}
                                        color={'#c9c9c9'}
                                        overflow="hidden"
                                        justify="space-evenly"
                                        paddingVertical={sizes.sm}
                                        renderToHardwareTextureAndroid
                                    >
                                        <Block align="center">
                                            <AppText size={sizes.h3} semibold={true}
                                                     p>{userData?.totalQuizCount}</AppText>
                                            <AppText>Total</AppText>
                                        </Block>
                                        <Block align="center">
                                            <AppText size={sizes.h3} semibold={true}
                                                     p>{userData?.userOngoingQuizCount}</AppText>
                                            <AppText>Ongoing</AppText>
                                        </Block>
                                        <Block align="center">
                                            <AppText size={sizes.h3} semibold={true}
                                                     p>{userData?.userSolvedQuizCount}</AppText>
                                            <AppText>Solved</AppText>
                                        </Block>
                                    </Block>
                                </TouchableOpacity>

                            </Block>
                        </View>

                        {isPremiumUser ?

                            <View style={{marginTop: sizes.m}}>
                                {getUserStatistics()}
                            </View>

                            :

                            <View style={{flex: 1, alignItems: 'center', marginTop: sizes.l + sizes.m}}>
                                {getSubscribePremiumContent()}
                            </View>

                        }

                        {/* Logout Button */}
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            marginTop: '10%',
                            marginBottom: sizes.xs
                        }}>
                            <Button radius={sizes.buttonRadius} width={'25%'} color={'#522f2f'}
                                    onPress={() => logoutInternal()}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <MaterialCommunityIcons name="logout" color={'#ffffff'} size={sizes.sm}/>
                                    <AppText size={sizes.smallText} color={'#ffffff'}> Logout </AppText>
                                </View>
                            </Button>
                            <View style={{justifyContent: 'flex-end'}}>
                                <AppText
                                    onPress={() => Linking.openURL('https://quizmarkt.com/life-in-the-uk/privacy-policy.html')}
                                    style={{textDecorationLine: 'underline'}} size={sizes.smallText} center={true}
                                    gray={true}>
                                    Privacy Policy
                                </AppText>
                            </View>
                        </View>

                    </>
                    :
                    <ProfileLoader/>
                }
            </View>
        </ScrollView>
    );
};

export interface ActivityData {
    count: string,
    date: number,
}

export default Profile;
