import React from 'react'
import ContentLoader from 'react-content-loader/native'
import {Circle, Rect} from "react-native-svg";
import {Dimensions} from "react-native";
import {useTheme} from "../hooks";

const {height, width} = Dimensions.get('window');

const ProfileLoader = props => {
    const {sizes} = useTheme();
    return (
        <ContentLoader
        speed={1}
        width={sizes.base *50}
        height={sizes.base *55}
        viewBox="10 0 450 500"
        backgroundColor="#bfbfc0"
        foregroundColor="#ecebeb"
        {...props}
    >
        <Rect x="41" y="3" rx="10" ry="10" width={width / 1.1} height={height / 5}/>
        <Rect x="41" y="200" rx="10" ry="10" width={width / 1.1} height={height / 7}/>
        <Rect x="41" y="350" rx="10" ry="10" width={width / 1.1} height={height / 7}/>
        <Circle cx="227" cy="80" r="39"/>
    </ContentLoader>);
}

export default ProfileLoader;
