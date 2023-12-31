import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from "@react-navigation/native";
import {useTheme} from "../hooks";

const BottomMenu = () => {
    let navigation = useNavigation();
    const {colors} = useTheme();

    return (
        <View style={styles.bottomMenu}>
            <TouchableOpacity onPress={()=> navigation.navigate('QuizGroupListScreen')} style={styles.menuItem}>
                <Icon name={'align-left'} size={30} color={colors.primary}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('QuizGroupListScreen')} style={styles.menuItem}>
                <Icon name="folder-o" size={30} color={colors.primary}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('SolvedQuizListScreen')} style={styles.menuItem}>
                <Icon name="user-o" size={30} color={colors.primary}/>
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
        opacity:0.95,
        borderTopWidth: 1,
        borderTopColor: '#b3b3b3',
    },
    menuItem: {
        padding: 16,
        paddingBottom:40
    },
});

export default BottomMenu;
