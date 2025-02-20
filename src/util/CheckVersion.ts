import {checkVersion} from "react-native-check-version";
import {Alert, BackHandler, Linking} from "react-native";

export async function getVersionInfo() {
    return await checkVersion({platform: "android", country: 'uk'});
}

export const checkVersionWithStoresInfo = async () => {
    try {
        const versionInfo = await getVersionInfo();
        console.log("Got version info:", versionInfo);

        if (versionInfo.needsUpdate && /^\d+\.\d+(\.0)?$/.test(versionInfo.version) && versionInfo.url) {
            Alert.alert(
                'Update Available',
                'A new version of the app is available. Please update to the latest version.',
                [
                    {
                        text: 'Update Now',
                        onPress: () => {
                            Linking.openURL(versionInfo.url);
                            setTimeout(() => BackHandler.exitApp(), 1000);
                        },
                    },
                ], {
                    cancelable: false
                }
            );
        }
    } catch (error) {
        console.error('Error checking app version:', error);
    }
};
