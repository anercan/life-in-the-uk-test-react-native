import React, {useCallback, useEffect, useState} from 'react';

import {useTheme} from '../hooks/';
import {Block} from '../components/';
import {useFocusEffect} from "@react-navigation/native";
import apiCaller from "../config/apiCaller";
import {ISolvedQuizCard} from "../constants/types";
import Tabs from "../components/Tabs";
import {TouchableOpacity} from "react-native";
import ListCard from "../components/ListCard";

const SolvedQuizListScreen = ({navigation}) => {
    const [tab, setTab] = useState<number>(0);
    const [quizCards, setQuizCards] = useState([{}]);
    const [filteredQuizCards, setFilteredQuizCards] = useState([{}]);
    const {sizes} = useTheme();

    useFocusEffect(
        useCallback(() => {
            apiCaller('user-quiz/get-user-quiz-list')
                .then(response => {
                    let dataList = response?.userQuizResponseList;
                    setQuizCards(dataList);
                    let onGoingQuizes = dataList?.filter((card: ISolvedQuizCard) => card?.state !== 'COMPLETED');
                    if (onGoingQuizes.length > 0) {
                        setFilteredQuizCards(onGoingQuizes);
                    } else {
                        setTab(1);
                    }
                });
        }, [])
    )

    useEffect(() => {
        if (tab === 0) {
            setFilteredQuizCards(quizCards.filter((card: ISolvedQuizCard) => card?.state !== 'COMPLETED'));
        } else {
            setFilteredQuizCards(quizCards.filter((card: ISolvedQuizCard) => card?.state === 'COMPLETED'));
        }
    }, [tab]);

    const setTabChange = (filter: number) => {
        setTab(filter);
    };

    function cardOnPress(card: any) {
        if (card?.state === 'COMPLETED') {
            navigation.navigate('CompletedQuizScreen', {
                quizName: card.quiz?.name,
                quizSize: card?.correctQuestionList?.length + card?.wrongQuestionList?.length,
                correctAnswerSize: card?.correctQuestionList?.length,
                quizCardList: [],
                quizGroupId: card?.quizGroupId,
                quizId: card.quiz?.id,
                //showRestartQuiz: true
            });
        } else {
            navigation.navigate('QuizScreen', {
                quizId: card.quiz.id,
                quizGroupId: card.quizGroupId,
                quizCardList: [],
                isReviewPage: false
            });
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString); // Parse the date string into a Date object

        const day = String(date.getDate()).padStart(2, '0'); // Get the day and pad with leading zero if necessary
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1 and pad with leading zero
        const year = date.getFullYear(); // Get the full year

        return `${day}.${month}.${year}`; // Format the date as DD-MM-YYYY
    }

    return (
        <Block>
            <Tabs tabOneText={'Recent'} tabTwoText={'Completed'} selectedTab={tab} hideSearch={true}
                  title={'My Quizzes'} callback={setTabChange}/>

            {/* quizCards list */}
            <Block
                scroll
                paddingHorizontal={15}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: sizes.l}}>
                <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
                    {filteredQuizCards?.map((card: any) => (
                        <TouchableOpacity key={`card-${card?.id}`} onPress={() => cardOnPress(card)}>
                            <ListCard
                                title={card?.quiz?.name}
                                rightBottomTitle={'Difficulty:'}
                                rightBottomDesc={card.quiz?.attributes?.difficulty}
                                rightTopText1={tab === 0 ? card?.correctQuestionList?.length + card?.wrongQuestionList?.length : undefined}
                                rightTopText2={tab === 0 ? card?.quiz?.activeQuestionCount : formatDate(card?.completeDate)}
                            />
                        </TouchableOpacity>
                    ))}
                </Block>
            </Block>
        </Block>
    );
};

export default SolvedQuizListScreen;
