import React, {useCallback, useContext, useEffect, useState} from 'react';

import {useTheme} from '../hooks/';
import {AppText, Block} from '../components/';
import {useFocusEffect} from "@react-navigation/native";
import {ISolvedQuizCard} from "../constants/types";
import Tabs from "../components/Tabs";
import ListCard from "../components/ListCard";
import {TitleContext} from "../context/TitleContext";
import useApiCaller from "../hooks/useApiCaller";
import {BulletList} from 'react-content-loader/native'

const SolvedQuizListScreen = ({navigation}) => {
    const {apiCaller} = useApiCaller();
    const [tab, setTab] = useState<number>(0);
    const [quizCards, setQuizCards] = useState([{}]);
    const [filteredQuizCards, setFilteredQuizCards] = useState([{}]);
    const {sizes} = useTheme();
    const {setTitle} = useContext(TitleContext);
    const [showLoader, setShowLoader] = useState(true);

    useFocusEffect(
        useCallback(() => {
            setTitle('My Quizzes');
            apiCaller('user-quiz/get-user-quiz-list')
                .then(response => {
                    setShowLoader(false);
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
            <Block flex={1}>
                <Tabs tabOneText={'Recents'} selectedTab={tab} tabTwoText={'Completed'} callback={setTabChange}/>
            </Block>
            <Block flex={9}>
                {!showLoader ?
                    <Block
                        scroll
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{paddingBottom: sizes.l}}
                    >
                        <Block
                            marginTop={sizes.m}
                            align={"center"}>
                            {filteredQuizCards?.length > 0 ?
                                filteredQuizCards?.map((card: any) => (
                                    <ListCard
                                        key={card?.quiz?.name}
                                        title={card?.quiz?.name}
                                        rightBottomTitle={'Difficulty: '}
                                        rightBottomDesc={card.quiz?.attributes?.difficulty}
                                        rightTopText1={tab === 0 ? card?.correctQuestionList?.length + card?.wrongQuestionList?.length : undefined}
                                        rightTopText2={tab === 0 ? card?.quiz?.activeQuestionCount : formatDate(card?.completeDate)}
                                        onPress={() => cardOnPress(card)}
                                    />
                                ))
                                :
                                <AppText h3 marginTop={sizes.sm} align={'center'}>
                                    {tab === 1 ? 'There is no completed quiz.' : 'There is no ongoing quiz!'}
                                </AppText>
                            }
                        </Block>
                    </Block>
                    :
                    <BulletList style={{marginTop:sizes.s,marginLeft:sizes.sm}} backgroundColor={'#c1c1c1'} height={sizes.base*22} width={sizes.base * 50} />
                }
            </Block>
        </Block>
    );
};

export default SolvedQuizListScreen;
