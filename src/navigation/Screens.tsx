import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
    QuizGroupListScreen,
    Profile,
    QuizListScreen,
    SolvedQuizListScreen,
    QuizScreen, LoginScreen
} from '../screens';
import CompletedQuizScreen from "../screens/CompletedQuizScreen";

const Stack = createStackNavigator();

const Screens = () => {

    return (
        <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{headerShown: false}}>
            <Stack.Screen name="QuizGroupListScreen" component={QuizGroupListScreen}/>
            <Stack.Screen name="QuizListScreen" component={QuizListScreen}/>
            <Stack.Screen name="QuizScreen" component={QuizScreen}/>
            <Stack.Screen name="CompletedQuizScreen" component={CompletedQuizScreen}/>
            <Stack.Screen name="SolvedQuizListScreen" component={SolvedQuizListScreen}/>
            <Stack.Screen name="Profile" component={Profile}/>
            <Stack.Screen name="LoginScreen" component={LoginScreen}/>
        </Stack.Navigator>
    );
};

export default Screens;
