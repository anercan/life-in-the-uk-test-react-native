import React, {useEffect, useState} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationCard from "components/NavigationCard";

const DailyCard = ({navigation}) => {
    const [subText, setSubtext] = useState('');

    useEffect(() => {
        isDailyChallengeSolved().then((r) => setSubtext(r ? 'Review Your Daily Quiz Report' : 'Your Daily Quiz is Ready!'));
    }, []);

    const isDailyChallengeSolved = async () => {
        return await AsyncStorage.getItem('dailyQuiz') === new Date().toISOString().split('T')[0];
    }

    const handlePress = () => {
        navigation.navigate('QuizScreen', {
            quizType: 'DAILY',
            quizCardList: [],
        });
    };

    return (
        <NavigationCard id={'dailyCard'} header={'Daily Challenge'} subText={subText} onPress={() => handlePress()}/>
    );
};

export default DailyCard;
