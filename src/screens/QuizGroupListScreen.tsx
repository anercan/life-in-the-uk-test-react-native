import React, {useCallback, useEffect, useState} from 'react';

import {useTheme} from '../hooks/';
import {Block} from '../components/';
import {StyleSheet, TouchableOpacity, View} from "react-native";
import apiCaller from "../config/apiCaller";
import {IQuizGroupCard} from "../constants/types";
import Tabs from "../components/Tabs";
import {GroupCard} from "../components";
import {useFocusEffect} from "@react-navigation/native";

const QuizGroupListScreen = ({navigation}) => {

    const [tab, setTab] = useState<number>(0);
    const [filteredQuizGroupCards, setFilteredQuizGroupCards] = useState([{}]);
    const [quizGroupCards, setQuizGroupCards] = useState([{}]);
    const {sizes} = useTheme();

    useFocusEffect(
        useCallback(() => {
            apiCaller('quiz-group/get-quiz-groups-with-user-quiz-data', 'POST', {pageSize: 25, page: 0})
                .then(response => {
                    let dataList = response?.quizGroupWithUserDataList;
                    setQuizGroupCards(dataList);
                    setFilteredQuizGroupCards(dataList?.filter((card: IQuizGroupCard) => card?.userSolvedCount !== card?.quizQuantity));
                });
        }, [])
    )

    useEffect(() => {
        if (tab === 0) {
            setFilteredQuizGroupCards(quizGroupCards.filter((card: IQuizGroupCard) => card?.userSolvedCount !== card?.quizQuantity));
        } else {
            setFilteredQuizGroupCards(quizGroupCards.filter((card: IQuizGroupCard) => card?.userSolvedCount === card?.quizQuantity));
        }
    }, [tab]);

    const setTabChange = (filter: number) => {
        setTab(filter);
    };

    const onPressQuizGroupCard = (card: IQuizGroupCard) => (
        navigation.navigate('QuizListScreen', {quizGroupId: card.id, quizGroupTitle: card.title})
    );

    const chunkArray = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    // Chunk the cardData array into rows of 2 cards
    const rows = chunkArray(filteredQuizGroupCards, 2);

    return (
        <Block>
            <Tabs tabOneText={'Recent'} tabTwoText={'Completed'} callback={setTabChange}
                  title={'Quiz Groups'}/>

            {/* quizGroupCards list */}
            <Block
                scroll
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: sizes.l}}>
                <View style={styles.container}>
                    {rows.map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.row}>
                            {row.map((card, cardIndex) => (
                                <TouchableOpacity key={`card-${card?.id}`} onPress={() => onPressQuizGroupCard(card)}>
                                    <GroupCard key={cardIndex} card={card}/>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </View>
            </Block>
        </Block>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    }
});


export default QuizGroupListScreen;
