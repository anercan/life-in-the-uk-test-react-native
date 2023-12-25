import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
    QuizGroupListScreen,
    Profile,
    Register,
    QuizListScreen,
    SolvedQuizListScreen,
    QuizScreen
} from '../screens';
import CompletedQuizScreen from "../screens/CompletedQuizScreen";

const Stack = createStackNavigator();

export default () => {

    return (
        <Stack.Navigator initialRouteName="QuizGroupListScreen">
            <Stack.Screen name="QuizGroupListScreen" component={QuizGroupListScreen} options={{headerShown: false}}/>
            <Stack.Screen name="QuizListScreen" component={QuizListScreen} options={{headerShown: false}}/>
            <Stack.Screen name="QuizScreen" component={QuizScreen} options={{headerShown: false}}/>
            <Stack.Screen name="CompletedQuizScreen" component={CompletedQuizScreen} options={{headerShown: false}}/>
            <Stack.Screen name="SolvedQuizListScreen" component={SolvedQuizListScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}}/>
            <Stack.Screen name="Register" component={Register} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
};
