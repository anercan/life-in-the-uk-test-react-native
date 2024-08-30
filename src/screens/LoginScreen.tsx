import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const LoginScreen = ({navigation}) => {

  const [userInfo, setUserInfo] = useState(null);

  const signIn = async () => {
    try {
      /*await GoogleSignin.hasPlayServices();
      const userInfo :any = await GoogleSignin.signIn();*/
      setUserInfo(null);
      console.log('User Info:', userInfo);
      navigation.navigate('QuizGroupListScreen');
    } catch (error) {
      /*if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play services not available or outdated');
      } else {
        Alert.alert('An unknown error occurred', error.message);
      }*/
    }
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Life In The UK Preparation Kit</Text>
        <Button title="Sign in with Google" onPress={signIn} />
        {userInfo && (
            <View style={styles.userInfo}>
              <Text style={styles.userInfoText}>Welcome, {userInfo.user.name}</Text>
              <Text style={styles.userInfoText}>{userInfo.user.email}</Text>
            </View>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  userInfo: {
    marginTop: 20,
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default LoginScreen;
