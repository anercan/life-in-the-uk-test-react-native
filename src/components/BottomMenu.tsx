import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from "@react-navigation/native";

const BottomMenu = () => {
    let navigation = useNavigation();
    return (
        <View style={styles.bottomMenu}>
            <TouchableOpacity onPress={()=> navigation.navigate('QuizGroupListScreen')} style={styles.menuItem}>
                <Icon name="home" size={30} color='#b2f6f6'/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('QuizGroupListScreen')} style={styles.menuItem}>
                <Icon name="search" size={30} color='#b2f6f6'/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('QuizGroupListScreen')} style={styles.menuItem}>
                <Icon name="heart" size={30} color='#b2f6f6'/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('SolvedQuizListScreen')} style={styles.menuItem}>
                <Icon name="check-square" size={30} color='#b2f6f6'/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomMenu: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#3e3939',
        borderTopWidth: 1,
        borderTopColor: '#b3b3b3',
    },
    menuItem: {
        padding: 16,
    },
});

export default BottomMenu;
