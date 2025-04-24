import React, {useCallback, useContext, useState} from 'react';

import {useTheme} from '../hooks/';
import {Block} from '../components/';
import {ScrollView, StyleSheet, View} from "react-native";
import {IQuizGroupCard} from "constants/types";
import {GroupCard} from "../components";
import {useFocusEffect} from "@react-navigation/native";
import {TitleContext} from "context/TitleContext";
import useApiCaller from "../hooks/useApiCaller";
import {checkReviewModalShown, chunkArray, groupCardBackgroundImages, randomColors} from "util/commonUtil";
import DailyCard from "components/DailyCard";
import InAppReview from "react-native-in-app-review";
import AsyncStorage from "@react-native-async-storage/async-storage";
import analytics from "@react-native-firebase/analytics";

const QuizGroupListScreen = ({navigation}) => {
    const {apiCaller} = useApiCaller(navigation);
    const [quizGroupCards, setQuizGroupCards] = useState([]);
    const {sizes} = useTheme();
    const {setTitle} = useContext(TitleContext);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: sizes.s,
        }
    });

    const handleReviewRequest = () => {
        checkReviewModalShown().then((reviewModalShownBefore: any) => {
            if (!reviewModalShownBefore && InAppReview.isAvailable()) {
                InAppReview.RequestInAppReview()
                    .then((hasFlowFinishedSuccessfully) => {
                        if (hasFlowFinishedSuccessfully) {
                            AsyncStorage.setItem('reviewModalShownBefore', 'true');
                            analytics().logEvent('review');
                        }
                    })
                    .catch((error) => {
                        AsyncStorage.setItem('reviewModalShownBefore', 'true');
                        analytics().logEvent('error-review-request', {errorDesc: error});
                    });
            }
        });
    }

    useFocusEffect(
        useCallback(() => {
            setTitle('Quiz Groups');
            apiCaller('quiz-group/get-quiz-groups-with-user-quiz-data', 'POST', {pageSize: 25, page: 0})
                .then(response => {
                    let dataList = response?.quizGroupWithUserDataList;
                    setQuizGroupCards(dataList);
                    const totalSolvedCount = (response?.quizGroupWithUserDataList ?? [])
                        .reduce((sum, item) => sum + (item.userSolvedCount ?? 0), 0);
                    if (totalSolvedCount > 2) {
                        handleReviewRequest();
                    }
                });
        }, [])
    )

    const onPressQuizGroupCard = (card: IQuizGroupCard) => (
        navigation.navigate('QuizListScreen', {quizGroupId: card.id, quizGroupTitle: card.title})
    );

    // Chunk the cardData array into rows of 2 cards
    const rows = chunkArray(quizGroupCards, 2);

    return (
        <Block>
            <ScrollView contentContainerStyle={{alignItems: 'center', marginTop: sizes.m}}>
                <DailyCard navigation={navigation}/>
                {rows.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((card, index) => (
                            <View key={row + '' + index} style={{marginRight: index == 0 ? sizes.sm : 0}}>
                                <GroupCard
                                    backgroundImage={groupCardBackgroundImages[(rowIndex * row.length) + index]}
                                    backgroundColor={randomColors[(rowIndex * row.length) + index]}
                                    card={card}
                                    onPress={() => onPressQuizGroupCard(card)}
                                />
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </Block>
    );
};


export default QuizGroupListScreen;
