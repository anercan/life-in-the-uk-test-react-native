import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {
    GoogleSignin, GoogleSigninButton,
    isErrorWithCode,
    isNoSavedCredentialFoundResponse,
    isSuccessResponse,
    statusCodes
} from '@react-native-google-signin/google-signin';
import apiCaller from "../config/apiCaller";
import {IQuizGroupCard} from "../constants/types";

function getGoogleConfig() {
    return {
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
        webClientId: '1017625843116-tj2gps7d9gsfd206psv7o76tqprekge2.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
    };
}

const LoginScreen = ({navigation}) => {

    const [state, setState] = useState<any>();

    useEffect(() => {
        console.log('useeffect')
        GoogleSignin.configure(getGoogleConfig());
        hasPreviousSignIn();
    }, []);

    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            console.log('evet')
            const response:any = await GoogleSignin.signIn();
            console.log('eve2t',response)
            if (isSuccessResponse(response)) {
                setState({userInfo: response.data});
                console.log(response)
                apiCaller('user-management/google-sign-in', 'POST', {token: response?.data?.idToken})
                    .then(response => {
                        console.log(response)
                    });
            } else {
                // sign in was cancelled by user
            }
        } catch (error) {
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.IN_PROGRESS:
                        console.log('error',error)
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        console.log('error',error)
                        break;
                    default:
                        console.log('error',error)
                }
            } else {
                console.log('error',error)
            }
        }
    };

    const getCurrentUser = async () => {
        try {
            const response:any = await GoogleSignin.signInSilently();
            if (isSuccessResponse(response)) {
                console.log('getCurrentUser',response)
                setState({ userInfo: response.data });
                navigation.navigate('QuizGroupListScreen')
            } else if (isNoSavedCredentialFoundResponse(response)) {
                // user has not signed in yet
            }
        } catch (error) {
            // handle errror
        }
    };

    const hasPreviousSignIn = async () => {
        const hasPreviousSignIn = GoogleSignin.hasPreviousSignIn();
        console.log('hasPreviousSignIn',hasPreviousSignIn)
        setState({ hasPreviousSignIn });
        getCurrentUser();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Life In The UK Test</Text>
            <GoogleSigninButton style={styles.googleButton}
                size={GoogleSigninButton.Size.Standard}
                onPress={() => {
                    signIn()
                }}
                disabled={false}
            />
            {state && (
            <View style={styles.userInfo}>
                <Text style={styles.userInfoText}>Welcome, {state?.userInfo?.name}</Text>
                <Text style={styles.userInfoText}>{state?.userInfo?.email}</Text>
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
    googleButton: {
    },

});

export default LoginScreen;
