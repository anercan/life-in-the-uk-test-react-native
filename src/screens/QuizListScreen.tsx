import React, {useCallback, useContext, useEffect, useState} from 'react';

import {useTheme} from '../hooks/';
import {AppText, Block} from '../components/';
import {RouteProp, useFocusEffect, useRoute} from "@react-navigation/native";
import {IQuizCard} from "constants/types";
import Tabs from "../components/Tabs";
import ListCard from "../components/ListCard";
import {TitleContext} from "context/TitleContext";
import useApiCaller from "../hooks/useApiCaller";

type QuizParams = {
    quizGroupTitle: number;
    quizGroupId: number;
};

type QuizListProp = RouteProp<{ QuizListProp: QuizParams }, 'QuizListProp'>;

const QuizListScreen = ({navigation}) => {
    const {apiCaller, loading} = useApiCaller();
    const route = useRoute<QuizListProp>();
    const {quizGroupId, quizGroupTitle} = route.params;
    const [tab, setTab] = useState<number>(0);
    const [quizCards, setQuizCards] = useState([{}]);
    const [filteredQuizCards, setFilteredQuizCards] = useState([{}]);
    const {sizes} = useTheme();
    const {setTitle} = useContext(TitleContext);

    useFocusEffect(
        useCallback(() => {
            setTitle(quizGroupTitle);

            apiCaller('quiz/get-quizzes-with-user-data', 'POST', {pageSize: 25, page: 0, quizGroupId: quizGroupId})
                .then(response => {
                    let quizList = response?.quizResponseWithUserDataList;
                    setQuizCards(quizList);
                    let onGoingQuizzes = quizList?.filter((card: IQuizCard) => card?.state !== 'COMPLETED');
                    let completedQuizzes = quizList?.filter((card: IQuizCard) => card?.state == 'COMPLETED');
                    if (onGoingQuizzes.length == 0) {
                        setFilteredQuizCards(completedQuizzes)
                        setTab(1);
                    } else {
                        setFilteredQuizCards(onGoingQuizzes);
                        setTab(0)
                    }
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
        if (!card.locked) {
            navigation.navigate('QuizScreen', {
                quizType:'REGULAR',
                quizId: card?.id,
                quizGroupId: quizGroupId,
                quizCardList: quizCardList,
            });
        } else {
            navigation.navigate('GetPremiumScreen');
        }
    }

    return (
        <Block>
            <Block flex={1}>
                <Tabs tabOneText={'Recent'} selectedTab={tab} tabTwoText={'Completed'} callback={setTabChange}/>
            </Block>
            <Block flex={9}>
                {!loading ?
                    <Block
                        scroll
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{paddingBottom: sizes.l}}
                    >
                        <Block
                            marginTop={sizes.m}
                            align={"center"}>
                            {filteredQuizCards?.length > 0 ?
                                filteredQuizCards.map((card: IQuizCard, index) => (
                                    <ListCard
                                        key={index}
                                        locked={card.locked}
                                        title={card.name}
                                        rightBottomTitle={'Difficulty: '}
                                        rightBottomDesc={card.attributes?.difficulty}
                                        rightTopText1={card.solvedCount + ''}
                                        rightTopText2={card.questionCount + ''}
                                        onPress={() => handleSelect(card, filteredQuizCards)}
                                    />
                                )) :
                                <AppText h3 marginTop={sizes.sm} align={'center'}>
                                    {tab === 1 ? 'There is no completed ' + quizGroupTitle + ' quiz!' : 'Congratulations, you solved them all!'}
                                </AppText>
                            }
                        </Block>
                    </Block>
                    :
                    <></>
                }
            </Block>
        </Block>
    );
};

export default QuizListScreen;
