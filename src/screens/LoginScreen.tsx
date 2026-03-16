import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
    GoogleSignin,
    isErrorWithCode,
    isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import {appleAuth, AppleButton} from '@invertase/react-native-apple-authentication';
import {AuthContext} from "context/AuthContext";
import {useTheme} from "../hooks";
import {AppText, GoogleSignInButton, AppLogo} from "../components";
import {getVersionInfo} from "util/checkVersion";
import {PermissionsAndroid, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {isAndroid} from "util/commonUtil";
import {logEvent, loginEvent} from "util/logUtil";
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
    const {googleLogin, appleLogin} = useUserManagementService(navigator);
    const isAppleLoginAvailable = appleAuth.isSupported;

    useEffect(() => {
        GoogleSignin.configure(getGoogleConfig());
        checkAppVersion();
        requestNotificationPermission();
        if (autoLogin) {
            //auto login for apple
            hasPreviousGoogleSignIn();
        }
    }, []);


    const onAppleButtonPress = async () => {
        try {
            const credential = await appleAuth.performRequest({
                requestedOperation: 1,//AppleRequestOperation.LOGIN,
                requestedScopes: [
                    0,//AppleRequestScope.EMAIL,
                    1,//AppleRequestScope.FULL_NAME,
                ]
            });

            const {identityToken, user, email, fullName} = credential;

            if (!identityToken) {
                return;
            }

            let signInRequest = {
                identityToken: identityToken,
                appId: 1,
                appleUserId: user,
                email: email ?? '',
                fullName: fullName ? `${fullName.givenName ?? ''} ${fullName.familyName ?? ''}`.trim() : '',
                deviceInfo: {
                    token: await fireBaseToken(),
                    osType: isAndroid() ? 'ANDROID' : 'IOS'
                }
            }

            appleLogin(signInRequest).then(response => {
                login(response.jwt);
                loginEvent('Apple');
            });

        } catch (error: any) {
            if (error.code === 'ERR_REQUEST_CANCELED') {
                logEvent('login_exit', {method: 'Apple'});
            } else {
                logEvent('login_error', {method: 'Google', code: error?.code, error: error?.toString()});
            }
        }
    };

    const checkAppVersion = () => {
        getVersionInfo().then((r) => setVersion(r.version))
    }

    const requestNotificationPermission = async () => {
        const androidVersion = typeof Platform.Version === 'string'
            ? parseInt(Platform.Version, 10)
            : Platform.Version;
        if (isAndroid() && androidVersion >= 33) {
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        }
    }

    const onGoogleSignInButtonPress = async () => {
        try {
            //await GoogleSignin.hasPlayServices();
            const response: any = await GoogleSignin.signIn();
            if (isSuccessResponse(response)) {
                loginWithGoogle(response);
            } else {
                logEvent('login_exit', {method: 'Google'});
            }
        } catch (error) {
            if (isErrorWithCode(error)) {
                logEvent('login_error', {method: 'Google', code: error.code});
            } else {
                logEvent('login_error', {method: 'Google', code: 'UNKNOWN', error: error?.toString()});
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

    const hasPreviousGoogleSignIn = async () => {
        const hasPreviousGoogleSignIn = GoogleSignin.hasPreviousSignIn();
        if (hasPreviousGoogleSignIn) {
            loginWithCurrentUser();
        }
    };

    const fireBaseToken = async () => {
        try {
            let token = await messaging().getToken();
            return token?.toString();
        } catch (e) {
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
            .catch((e) => logEvent('login_service_error', {method: 'Google', error: e}));
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background,
        },
        logoWrapper: {
            marginTop: sizes.xxxl,
            marginBottom: sizes.base * 25,
        },
        mailText: {
            textAlign: "center",
            fontFamily: fonts.text,
            fontSize: sizes.smallText,
            color: colors.gray
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.logoWrapper}>
                <AppLogo/>
            </View>
            <GoogleSignInButton onPress={onGoogleSignInButtonPress}/>
            {!isAndroid() && isAppleLoginAvailable &&
                <AppleButton
                    buttonStyle={AppleButton.Style.WHITE_OUTLINE}
                    buttonType={AppleButton.Type.SIGN_IN}
                    cornerRadius={sizes.l}
                    style={{width: sizes.base * 35, height: sizes.xl, marginTop: sizes.m}}
                    onPress={onAppleButtonPress}
                />
            }
            <View style={{marginTop: 'auto', marginBottom: sizes.m}}>
                <AppText style={styles.mailText}>team@quizmarkt.com</AppText>
                {version != '' && version != 'null' &&
                    <AppText style={styles.mailText}>v.{version}</AppText>
                }
            </View>
        </View>
    );
};

export default LoginScreen;
