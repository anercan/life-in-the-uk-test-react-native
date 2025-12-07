import React, {useCallback, useContext, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useTheme} from '../hooks/';
import {TitleContext} from "context/TitleContext";
import {useFocusEffect} from "@react-navigation/native";
import NavigationBox from "components/NavigationBox";
import ActivityModal from "components/ActivityModal";
import ProfileHeader from "components/ProfileHeader";
import {UserDataResponse} from "constants/types";
import {useUserManagementService} from "services/UserManagementService";

const Profile = ({navigation}) => {
    const {getUserInfo} = useUserManagementService(navigation);
    const {sizes} = useTheme();
    const [userData, setUserData] = useState<UserDataResponse>();
    const {setTitle} = useContext(TitleContext);
    const [modalVisible, setModalVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setTitle('Profile');
            getUserInfo()
                .then((profileResponse: any) => {
                    setUserData(profileResponse);
                });
        }, [])
    )


    const styles = StyleSheet.create({
        activity: {
            flexDirection: 'column',
            marginTop: sizes.sm,
            marginBottom: sizes.s,
            marginHorizontal: sizes.s,
            flex: 1
        }
    });

    return (
        <ScrollView>
            <View style={styles.activity}>
                <ProfileHeader userData={userData} navigation={navigation}/>
                <View>
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
            </View>
            <ActivityModal navigation={navigation} modalVisible={modalVisible}
                           onPressClose={() => setModalVisible((prevState => !prevState))}/>
        </ScrollView>
    );
};
export default Profile;
