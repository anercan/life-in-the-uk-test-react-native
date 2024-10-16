import React, {useCallback, useContext, useEffect, useState} from 'react';

import {useTheme} from '../hooks/';
import {Block} from '../components/';
import {StyleSheet, TouchableOpacity, View} from "react-native";
import apiCaller from "../config/apiCaller";
import {IQuizGroupCard} from "../constants/types";
import Tabs from "../components/Tabs";
import {GroupCard} from "../components";
import {useFocusEffect} from "@react-navigation/native";
import {TitleContext} from "../context/TitleContext";

const QuizGroupListScreen = ({navigation}) => {
    const [quizGroupCards, setQuizGroupCards] = useState([{}]);
    const {sizes} = useTheme();
    const { setTitle } = useContext(TitleContext);

    useFocusEffect(
        useCallback(() => {
            setTitle('Quiz Groups');
            apiCaller('quiz-group/get-quiz-groups-with-user-quiz-data', 'POST', {pageSize: 25, page: 0})
                .then(response => {
                    let dataList = response?.quizGroupWithUserDataList;
                    setQuizGroupCards(dataList);
                });
        }, [])
    )

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
    const rows = chunkArray(quizGroupCards, 2);

    return (
        <Block marginTop={15}>
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
