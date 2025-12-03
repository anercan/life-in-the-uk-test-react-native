import React, {useCallback, useContext, useState} from 'react';

import {useTheme} from '../hooks/';
import {Block} from '../components/';
import {useFocusEffect} from "@react-navigation/native";
import {ISolvedQuizCard} from "constants/types";
import Tabs from "../components/Tabs";
import ListCard from "../components/ListCard";
import {TitleContext} from "context/TitleContext";
import useApiCaller from "../hooks/useApiCaller";
import {getProgress} from "util/commonUtil";
import StatusBox from "components/StatusBox";

const SolvedQuizListScreen = ({navigation}) => {
    const {apiCaller} = useApiCaller();
    const [tab, setTab] = useState<number>(0);
    const [quizCards, setQuizCards] = useState([]);
    const [filteredQuizCards, setFilteredQuizCards] = useState([]);
    const {sizes} = useTheme();
    const {setTitle} = useContext(TitleContext);

    useFocusEffect(
        useCallback(() => {
            setTitle('My Quizzes');
            apiCaller('user-quiz/get-user-quiz-list')
                .then(response => {
                    let dataList = response?.userQuizResponseList;
                    setQuizCards(dataList);
                    setInitialTab(dataList);
                });
        }, [])
    )

    const filterTabs = (selected, cards = quizCards) => {
        if (selected !== 'COMPLETED') {
            setTab(0);
            setFilteredQuizCards(cards.filter((card: ISolvedQuizCard) => card?.state !== 'COMPLETED'));
        } else {
            setTab(1);
            setFilteredQuizCards(cards.filter((card: ISolvedQuizCard) => card?.state === 'COMPLETED'));
        }
    }

    const setInitialTab = (dataList) => {
        let onGoingQuizes = dataList?.filter((card: ISolvedQuizCard) => card?.state !== 'COMPLETED');
        if (onGoingQuizes.length > 0) {
            filterTabs('ONGOING', dataList);
        } else {
            filterTabs('COMPLETED', dataList);
        }
    }

    const setTabChange = (filter: number) => {
        filterTabs(filter === 1 ? 'COMPLETED' : 'ONGOING');
    };

    const cardOnPress = (card: any) => {
        if (card?.state === 'COMPLETED') {
            navigation.navigate('CompletedQuizScreen', {
                quizType: 'REGULAR',
                quizName: card.quiz?.name,
                quizSize: card?.correctQuestionList?.length + card?.wrongQuestionList?.length,
                correctAnswerSize: card?.correctQuestionList?.length,
                wrongAnswerSize: card?.wrongQuestionList?.length,
                quizCardList: [],
                quizGroupId: card?.quizGroupId,
                quizId: card.quiz?.id,
            });
        } else {
            navigation.navigate('QuizScreen', {
                quizType: 'REGULAR',
                quizId: card.quiz.id,
                quizGroupId: card.quizGroupId,
                quizCardList: []
            });
        }
    }

    return (
        <Block>
            <Block flex={0}>
                <Tabs tabOneText={'Ongoing'} selectedTab={tab} tabTwoText={'Completed'} callback={setTabChange}/>
            </Block>
            <Block flex={9} style={{marginTop:sizes.sm}}>
                <Block scroll>
                    <Block align={"center"}>
                        {filteredQuizCards?.length > 0 ?
                            filteredQuizCards?.map((card: any) => (
                                <ListCard
                                    key={card?.quiz?.name}
                                    title={card?.quiz?.name}
                                    rightBottomDesc={card.quiz?.attributes?.difficulty}
                                    rightTopText1={tab === 0 ? card?.correctQuestionList?.length + card?.wrongQuestionList?.length : undefined}
                                    rightTopText2={tab === 0 ? card?.quiz?.activeQuestionCount : getProgress(card?.correctQuestionList?.length, card?.quiz?.activeQuestionCount)}
                                    onPress={() => cardOnPress(card)}
                                />
                            ))
                            :
                            <StatusBox text={tab === 1 ? 'You haven’t completed any quizzes yet.' : 'There are no ongoing quizzes right now.'}/>
                        }
                    </Block>
                </Block>
            </Block>
        </Block>
    );
};

export default SolvedQuizListScreen;
