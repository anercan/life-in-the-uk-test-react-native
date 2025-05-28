import React, {useContext, useEffect, useState} from 'react';
import {useTheme} from '../hooks/';
import {ScrollView} from "react-native";
import {TitleContext} from "context/TitleContext";
import useApiCaller from "../hooks/useApiCaller";
import {
    capitalizeWords,
    getColorFromPalette,
    getShortenText,
} from "util/commonUtil";
import DataDistributionCard from "components/DataDistribution";

const AnalyseScreen = ({navigation}) => {
    const {apiCaller} = useApiCaller(navigation);
    const [incorrectList, setIncorrectList] = useState<any[]>([]);
    const {sizes} = useTheme();
    const {setTitle} = useContext(TitleContext);
    const [isLoading,setLoading] = useState<boolean>(true);

    useEffect(() => {
        setTitle('Analytics')
        apiCaller('profile/get-user-quiz-analyses')
            .then((response: any) => {
                setLoading(false);
                if (response?.wrongsMap) {
                    let incorrectDataList: any[] = [];
                    let wrongsMap = response.wrongsMap;
                    const maxIncorrectKey = Object.entries(wrongsMap)?.reduce((max, entry) => Number(entry[1]) > Number(max[1]) ? entry : max)[0];
                    Object.entries(wrongsMap).forEach(([key, val], index) => {
                        incorrectDataList.push({
                            focused: maxIncorrectKey === key,
                            name: getShortenText(capitalizeWords(key), 50),
                            value: val,
                            color: getColorFromPalette(index),
                        });
                    });
                    setIncorrectList(incorrectDataList);
                }
            });
    }, []);

    return (
        <ScrollView contentContainerStyle={{ paddingVertical: sizes.m,paddingHorizontal:sizes.sm}}>
            <DataDistributionCard propData={incorrectList} isLoadingProp={isLoading}/>
        </ScrollView>
    );
};


export default AnalyseScreen;
