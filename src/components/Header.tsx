import React, {useContext} from 'react';
import {View, Text, StyleSheet, StatusBar, Dimensions, TouchableOpacity} from 'react-native';
import {useTheme} from "../hooks";
import {TitleContext} from "../context/TitleContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {useNavigation} from '@react-navigation/native'; 

const {height} = Dimensions.get('window');

const Header = () => {
    const {getTitle} = useContext(TitleContext);
    const {fonts} = useTheme();
    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.headerContainer}>
            <StatusBar backgroundColor='#012169'/>
            <View style={styles.row}>
                {navigation.canGoBack() &&
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <MaterialCommunityIcons name='arrow-left' color={'#e8e8e8'} size={28}/>
                    </TouchableOpacity>}
                <Text style={{
                    marginTop: 35,
                    marginLeft: navigation.canGoBack() ? -60 : 0,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                    fontSize: 23,
                    color: '#e8e8e8',
                    flex: 1,
                }}>
                    {getTitle()}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: height / 9,
        backgroundColor: '#012169',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    backButton: {
        marginTop: 38,
        padding: 15,
        zIndex: 1
    }
});

export default Header;
