import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";

const getUserDataFromCookie = async () => {
    try {
        let jwt: any =await AsyncStorage.getItem('authToken');
        return jwtDecode(jwt);
    } catch (e) {
        return null;
    }
};

export const getUserPremiumType = async () => {
    let userData: any = await getUserDataFromCookie();
    return userData['premium-type'];
}

export const isLevel1Premium = () => {
    let userData: any = getUserDataFromCookie();
    return 'LEVEL1' === userData['premium-type'];
}

export const isPremium = async () => {
    try {
        let premiumType: any = await getUserPremiumType();
        return premiumType !== 'NONE';
    } catch (e) {
        return false;
    }
}

