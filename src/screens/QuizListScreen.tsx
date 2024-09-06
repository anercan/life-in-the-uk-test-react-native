import React, {useCallback, useEffect, useState} from 'react';

import {useTheme} from '../hooks/';
import {Block} from '../components/';
import {useFocusEffect, useRoute} from "@react-navigation/native";
import apiCaller from "../config/apiCaller";
import {IQuizCard} from "../constants/types";
import Tabs from "../components/Tabs";
import {TouchableOpacity} from "react-native-gesture-handler";
import ListCard from "../components/ListCard";

const QuizListScreen = ({navigation}) => {
    const route = useRoute();
    const {quizGroupId, quizGroupTitle} = route.params;
    const [tab, setTab] = useState<number>(0);
    const [quizCards, setQuizCards] = useState([{}]);
    const [filteredQuizCards, setFilteredQuizCards] = useState([{}]);
    const {sizes} = useTheme();

    useFocusEffect(
        useCallback(() => {
            apiCaller('quiz/get-quizzes-with-user-data', 'POST', {pageSize: 25, page: 0, quizGroupId: quizGroupId})
                .then(response => {
                    let dataList = response?.quizResponseWithUserDataList;
                    setQuizCards(dataList);
                    setFilteredQuizCards(dataList?.filter((card: IQuizCard) => card?.state !== 'COMPLETED'));
                });
        }, [])
    )

    useEffect(() => {
        if (tab === 0) {
            setFilteredQuizCards(quizCards.filter((card: IQuizCard) => card?.state !== 'COMPLETED'));
        } else {
            setFilteredQuizCards(quizCards.filter((card: IQuizCard) => card?.state === 'COMPLETED'));
        }
    }, [tab]);

    const setTabChange = (filter: number) => {
        setTab(filter);
    };

    const startQuiz = (card: IQuizCard, quizCardList: IQuizCard[]) => {
        navigation.navigate('QuizScreen', {
            quizId: card?.id,
            quizGroupId: quizGroupId,
            quizCardList: quizCardList,
            isReviewPage: false
        })
    }

    return (
        <Block>
            <Tabs tabOneText={'Recent'} tabTwoText={'Completed'} title={quizGroupTitle}
                  callback={setTabChange}/>

            {/* quizCards list */}
            <Block
                scroll
                paddingHorizontal={15}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: sizes.l}}>
                <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
                    {filteredQuizCards.map((card: IQuizCard, index) => (
                        <TouchableOpacity key={`card-${card?.id}`} onPress={() => startQuiz(card, filteredQuizCards)}>
                            <ListCard
                                title={card.name}
                                rightBottomTitle={'Difficulty:'}
                                rightBottomDesc={card.attributes?.difficulty}
                                rightTopText1={card.solvedCount + ''}
                                rightTopText2={card.questionCount + ''}
                            />
                        </TouchableOpacity>
                    ))}
                </Block>
            </Block>
        </Block>
    );
};

export default QuizListScreen;
