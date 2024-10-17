import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";

const getUserDataFromCookie = async () => {
    try {
        let jwt: any = await AsyncStorage.getItem('authToken');
        return jwtDecode(jwt);
    } catch (e) {
        return null;
    }
};

export const getUserPremiumType = async () => {
    let userData: any = await getUserDataFromCookie();
    return userData?.premiumType;
}

