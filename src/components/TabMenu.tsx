import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Profile from "../screens/Profile";
import SolvedQuizListScreen from "../screens/SolvedQuizListScreen";
import Screens from "../navigation/Screens";

const Tab = createBottomTabNavigator();

const TabMenu = () => {
    return (
        <Tab.Navigator
            initialRouteName="Screens"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#ffffff', // White color for active items
                tabBarInactiveTintColor: '#d1d1d1', // Light gray color for inactive items
                tabBarLabelStyle: {
                    fontSize: 12, // Optional: customize font size
                },                tabBarStyle: {
                    backgroundColor: '#012169', // Dark blue background
                    height: 80, // Custom height
                    paddingBottom: 4, // Optional: add padding for better item placement
                    paddingTop: 1, // Optional: add padding for better item placement
                },
            }}
        >
            <Tab.Screen
                name="Screens"
                component={Screens}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="home" color={color} size={size}/>
                    ),
                }}
            />
            <Tab.Screen
                name="Feed"
                component={SolvedQuizListScreen}
                options={{
                    tabBarLabel: 'My Quizzes',
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="file-document-multiple" color={color} size={size}/>
                    ),
                }}
            />
            {/*<Tab.Screen
                name="Notifications"
                component={SolvedQuizListScreen}
                options={{
                    tabBarLabel: 'Updates',
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="bell" color={color} size={size}/>
                    ),
                    tabBarBadge: 3,
                }}
            />*/}
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="account" color={color} size={size}/>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default TabMenu;
