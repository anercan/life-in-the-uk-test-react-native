import React from 'react'
import ContentLoader from 'react-content-loader/native'
import {Circle, Rect} from "react-native-svg";
import {Dimensions} from "react-native";
import {useTheme} from "../hooks";

const {height, width} = Dimensions.get('window');

const GroupLoader = (props) => {
    const {sizes} = useTheme();

    return (
        <ContentLoader
            speed={2}
            width={sizes.base *55}
            height={sizes.base *55}
            viewBox="-30 45 550 140"
            backgroundColor="#bfbfc0"
            foregroundColor="#ecebeb"
            {...props}
        >
            <Rect x="0" y="16" rx="15" ry="15" width={sizes.xxxxl} height={sizes.xxxl}/>
            <Rect x="240" y="16" rx="15" ry="15" width={sizes.xxxxl} height={sizes.xxxl}/>
            <Circle cx="190" cy="22" r="19"/>
            <Circle cx="430" cy="25" r="19"/>
        </ContentLoader>
    )
};

export default GroupLoader;
