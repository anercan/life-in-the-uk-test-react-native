import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Image, Linking} from 'react-native';
import {
    GoogleSignin,
    isErrorWithCode,
    isNoSavedCredentialFoundResponse,
    isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import {AuthContext} from "../context/AuthContext";
import useApiCaller from "../hooks/useApiCaller";
import {useTheme} from "../hooks";
import {AppText} from "../components";
import {getVersionInfo} from "../util/CheckVersion";

function getGoogleConfig() {
    return {
        scopes: ['profile', 'email'],
        webClientId: '1017625843116-hhm7slkdg57nrc0vr8t3i5gagacdp40a.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
    };
}

const LoginScreen = ({navigation}) => {
    const {apiCaller} = useApiCaller();
    const {login} = useContext(AuthContext);
    const {fonts, sizes, colors} = useTheme();
    const [version, setVersion] = useState("");

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#295780',
        },
        iconImage: {
            width: sizes.base * 3,
            height: sizes.base * 3,
        },
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#4285F4',
            height: sizes.xl,
            width: sizes.base * 30,
            paddingVertical: sizes.xs,
            paddingHorizontal: sizes.xs,
            borderRadius: sizes.md,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 3},
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
        },
        iconContainer: {
            backgroundColor: '#fff',
            borderRadius: sizes.xxxl,
            width: sizes.base * 5,
            height: sizes.base * 5,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: sizes.sm,
        },
        text: {
            color: '#fff',
            fontFamily: fonts.p,
            fontSize: sizes.text,
            fontWeight: 'thin',
        },
        logoContainer: {
            marginTop: sizes.xxxl,
            width: sizes.base * 20, // Adjust size as needed
            height: sizes.base * 20,
            borderRadius: sizes.xxl,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: '#cecece',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 5,
            marginBottom: sizes.base * 14,
            elevation: 5, // Drop shadow on Android
        },
        logo: {
            width: '100%',
            height: '100%',
            resizeMode: 'cover', // Ensures the image scales to fill the circle
        },
    });

    useEffect(() => {
        GoogleSignin.configure(getGoogleConfig());
        getVersionInfo().then((r) => setVersion(r.version + ""))
        //hasPreviousSignIn();
    }, []);

    const googleSignIn = async () => {
        try {
            let hasPlayServices = await GoogleSignin.hasPlayServices();
            const response: any = await GoogleSignin.signIn();
            if (isSuccessResponse(response)) {
                loginWithGoogle(response);
            } else {
                console.log('error', response)
            }
        } catch (error) {
            if (isErrorWithCode(error)) {
                console.log('error', error)
            } else {
                console.log('error', error)
            }
        }
    };

    const loginWithCurrentUser = async () => {
        try {
            const response: any = await GoogleSignin.signInSilently();
            if (isSuccessResponse(response)) {
                loginWithGoogle(response);
            } else if (isNoSavedCredentialFoundResponse(response)) {
                // user has not signed in yet
            }
        } catch (error) {
            // handle errror
        }
    };

    const hasPreviousSignIn = async () => {
        const hasPreviousSignIn = GoogleSignin.hasPreviousSignIn();
        if (hasPreviousSignIn) {
            loginWithCurrentUser();
        }
    };

    const loginWithGoogle = (response: any) => {
        apiCaller('user-management/google-sign-in', 'POST', {token: response?.data?.idToken, appId: 1})
            .then((response) => {
                login(response.jwt);
            })
            .catch(() => alert('Login Failed'));
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/images/lifeintheukapp-logo.png')} // Replace with your app's logo path
                    style={styles.logo}
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={() => googleSignIn()}>
                <View style={styles.iconContainer}>
                    <Image
                        style={styles.iconImage}
                        resizeMethod={'auto'}
                        source={require('../assets/icons/google2.png')}
                    />
                </View>
                <Text style={styles.text}>Login with Google</Text>
            </TouchableOpacity>
            <View style={{marginTop: sizes.xxl}}>
                <AppText center={true} size={sizes.smallText} gray={true}>team@quizmarkt.com</AppText>
                <AppText onPress={() => Linking.openURL('https://quizmarkt.com/life-in-the-uk/privacy-policy.html')}
                         style={{textDecorationLine: 'underline'}} size={sizes.smallText} center={true} gray={true}>
                    Privacy Policy
                </AppText>
                {version != '' && version != 'null' &&
                    <AppText center={true} size={sizes.smallText} gray={true}>{version}</AppText>
                }
            </View>
        </View>
    );
};

export default LoginScreen;
