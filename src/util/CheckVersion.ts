import {checkVersion} from "react-native-check-version";
import {Alert, Linking} from "react-native";

export async function getVersionInfo() {
    return await checkVersion({platform: "android", country: 'uk'});
}

export const checkVersionWithStoresInfo = async () => {
    try {
        const version = await getVersionInfo();
        console.log("Got version info:", version);

        if (version.needsUpdate && version.url) {
            Alert.alert(
                'Update Available',
                'A new version of the app is available. Please update to the latest version.',
                [
                    {
                        text: 'Update Now',
                        onPress: () => {
                            Linking.openURL(version.url);
                        },
                    },
                    // {text: 'Later'},
                ]
            );
        }
    } catch (error) {
        console.error('Error checking app version:', error);
    }
};
