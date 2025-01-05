import React from 'react'
import ContentLoader from 'react-content-loader/native'
import {Circle, Rect} from "react-native-svg";
import {Dimensions} from "react-native";

const {height, width} = Dimensions.get('window');

const CardLoader = props => (
    <ContentLoader
        speed={2}
        width={width/0.8}
        height={height/7}
        viewBox="5 -20 500 130"
        backgroundColor="#bfbfc0"
        foregroundColor="#ecebeb"
        {...props}
    >
        <Rect x="5" y="-1" rx="12" ry="12" width={width/1.1} height={height/9} />
    </ContentLoader>
)

export default CardLoader;
