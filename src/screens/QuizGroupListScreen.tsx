import React, {useCallback, useContext, useState} from 'react';

import {useTheme} from '../hooks/';
import {Block} from '../components/';
import {StyleSheet, View} from "react-native";
import {IQuizGroupCard} from "constants/types";
import {GroupCard} from "../components";
import {useFocusEffect} from "@react-navigation/native";
import {TitleContext} from "context/TitleContext";
import useApiCaller from "../hooks/useApiCaller";
import {BulletList} from 'react-content-loader/native'

const QuizGroupListScreen = ({navigation}) => {
    const {apiCaller} = useApiCaller();
    const [quizGroupCards, setQuizGroupCards] = useState([{}]);
    const {sizes} = useTheme();
    const { setTitle } = useContext(TitleContext);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: sizes.m,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: sizes.s,
        }
    });

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
        for (let i = 0; i < array?.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    // Chunk the cardData array into rows of 2 cards
    const rows = chunkArray(quizGroupCards, 2);

    return (
        <Block>
            {quizGroupCards?.length > 1 ?
                <Block
                    scroll
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: sizes.l}}>
                    <View style={styles.container}>
                        {rows.map((row, rowIndex) => (
                            <View key={rowIndex} style={styles.row}>
                                {row.map((card,index) => (
                                    <View key={row + index} style={{marginRight: index == 0 ? sizes.sm : 0}}>
                                        <GroupCard
                                            card={card}
                                            onPress={() => onPressQuizGroupCard(card)}
                                        />
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </Block>
                :
                <>
                    <BulletList style={{marginTop:sizes.l,marginLeft:sizes.sm}} backgroundColor={'#c1c1c1'} height={sizes.base*20} width={sizes.base * 50} />
                </>

            }
        </Block>
    );
};


export default QuizGroupListScreen;
