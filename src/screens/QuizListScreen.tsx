import React, {useCallback, useContext, useEffect, useState} from 'react';

import {useTheme} from '../hooks/';
import {Block} from '../components/';
import {useFocusEffect, useRoute} from "@react-navigation/native";
import apiCaller from "../config/apiCaller";
import {IQuizCard} from "../constants/types";
import Tabs from "../components/Tabs";
import {TouchableOpacity} from "react-native-gesture-handler";
import ListCard from "../components/ListCard";
import {TitleContext} from "../context/TitleContext";

const QuizListScreen = ({navigation}) => {
    const route = useRoute();
    const {quizGroupId, quizGroupTitle} = route.params;
    const [tab, setTab] = useState<number>(0);
    const [quizCards, setQuizCards] = useState([{}]);
    const [filteredQuizCards, setFilteredQuizCards] = useState([{}]);
    const {sizes} = useTheme();
    const { setTitle } = useContext(TitleContext);


    useFocusEffect(
        useCallback(() => {
            setTitle(quizGroupTitle);
            apiCaller('quiz/get-quizzes-with-user-data', 'POST', {pageSize: 25, page: 0, quizGroupId: quizGroupId})
                .then(response => {
                    let dataList = response?.quizResponseWithUserDataList;
                    setQuizCards(dataList);
                    console.log(dataList)
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

    const handleSelect = (card: IQuizCard, quizCardList: IQuizCard[]) => {
        if(!card.locked) {
            navigation.navigate('QuizScreen', {
                quizId: card?.id,
                quizGroupId: quizGroupId,
                quizCardList: quizCardList,
                isReviewPage: false
            });
        } else {
            navigation.navigate('GetPremiumScreen');
        }
    }

    return (
        <Block>
            <Tabs tabOneText={'Recent'} tabTwoText={'Completed'} callback={setTabChange}/>

            {/* quizCards list */}
            <Block
                scroll
                paddingHorizontal={15}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: sizes.l}}>
                <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
                    {filteredQuizCards.map((card: IQuizCard) => (
                        <TouchableOpacity key={`card-${card?.id}`} onPress={() => handleSelect(card, filteredQuizCards)}>
                            <ListCard
                                locked={card.locked}
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
