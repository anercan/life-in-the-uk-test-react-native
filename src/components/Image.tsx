import React from 'react';
import {
    StyleSheet,
    Image as RNImage,
    ImageStyle,
    ImageBackground,
    Platform,
} from 'react-native';


const Image = ({
                   id = 'Image',
                   style,
                   children = undefined,
                   background = false,
                   ...props
               }) => {

    const imageStyles = StyleSheet.flatten([
        {
            resizeMode: 'contain',
        },
        style
    ]) as ImageStyle;

    const imageID = Platform.OS === 'android' ? {accessibilityLabel: id} : {testID: id};

    if (background) {
        return (
            <ImageBackground {...imageID} style={imageStyles} {...props}>
                {children}
            </ImageBackground>
        );
    }

    return <RNImage {...imageID} style={imageStyles} {...props} />;
};

export default Image;
