import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Linking} from 'react-native';
import {
    GoogleSignin,
    isErrorWithCode,
    isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import {AuthContext} from "context/AuthContext";
import {useTheme} from "../hooks";
import {AppText} from "../components";
import {getVersionInfo} from "util/checkVersion";
import {PermissionsAndroid, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {isAndroid} from "util/commonUtil";
import {loginEvent} from "util/logUtil";
import {useUserManagementService} from "services/UserManagementService";

function getGoogleConfig() {
    return {
        scopes: ['profile', 'email'],
        webClientId: '1017625843116-hhm7slkdg57nrc0vr8t3i5gagacdp40a.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
        iosClientId: '1017625843116-3m6e8ejpaneolpur9ahvu0cahhrqi25n.apps.googleusercontent.com'
    };
}

const LoginScreen = () => {
    const {login, autoLogin} = useContext(AuthContext);
    const {fonts, sizes, colors} = useTheme();
    const [version, setVersion] = useState("");
    const {googleLogin} = useUserManagementService(navigator);

    useEffect(() => {
        GoogleSignin.configure(getGoogleConfig());
        checkAppVersion();
        requestNotificationPermission();
        if (autoLogin) {
            hasPreviousSignIn();
        }
    }, []);

    const checkAppVersion = () => {
        getVersionInfo().then((r) => setVersion(r.version))
    }

    const requestNotificationPermission = async () => {
        if (isAndroid() && Platform.Version >= 33) {
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        }
    }

    const googleSignIn = async () => {
        try {
            //await GoogleSignin.hasPlayServices();
            const response: any = await GoogleSignin.signIn();
            if (isSuccessResponse(response)) {
                loginWithGoogle(response);
            } else {
                alert('Login Failed!')
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
            }
        } catch (error) {
        }
    };

    const hasPreviousSignIn = async () => {
        const hasPreviousSignIn = GoogleSignin.hasPreviousSignIn();
        if (hasPreviousSignIn) {
            loginWithCurrentUser();
        }
    };

    const fireBaseToken = async () => {
        try {
            let token = await messaging().getToken();
            return token?.toString();
        } catch (e) {
            console.log(e);
            return null;
        }
    };

    const loginWithGoogle = async (response: any) => {
        let signInRequest = {
            token: response?.data?.idToken,
            appId: 1,
            deviceInfo: {
                token: await fireBaseToken(),
                osType: isAndroid() ? 'ANDROID' : 'IOS'
            }
        }

        googleLogin(signInRequest)
            .then((response) => {
                login(response.jwt);
                loginEvent('Google');
            })
            .catch(() => alert('Login Failed'));
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background,
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
            marginBottom: sizes.base * 14,
        },
        logo: {
            width: '100%',
            height: '100%',
            resizeMode: 'cover', // Ensures the image scales to fill the circle
        },
        mailText: {
            textAlign: "center",
            fontSize: sizes.smallText,
            color: colors.gray
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/images/lifeintheukapp-logo.png')}
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
                <AppText style={styles.text}>Login with Google</AppText>
            </TouchableOpacity>
            <View style={{marginTop: sizes.xxxl}}>
                <AppText style={styles.mailText}>team@quizmarkt.com</AppText>
                <AppText onPress={() => Linking.openURL('https://quizmarkt.com/life-in-the-uk/privacy-policy.html')}
                         style={{...styles.mailText, textDecorationLine: 'underline'}}>
                    Privacy Policy
                </AppText>
                {version != '' && version != 'null' &&
                    <AppText style={styles.mailText}>{version}</AppText>
                }
            </View>
        </View>
    );
};

export default LoginScreen;
