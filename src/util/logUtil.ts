import analytics from "@react-native-firebase/analytics";
import {getUserId} from "util/jwtUtil";
import crashlytics from "@react-native-firebase/crashlytics";

export const logEvent = (eventName, param?) => {
    try {
        if (__DEV__) {
            console.log(`Event: ${eventName}`, param);
        } else {
            if (param) {
                analytics().logEvent(eventName, param);
            } else {
                analytics().logEvent(eventName);
            }
        }
    } catch (e) {
        console.error("Log event failed:", e);
    }
}

export const loginEvent = (loginMethod) => {
    try {
        if (__DEV__) {
            console.log("Logging in with Google...");
        } else {
            analytics().logLogin({method: loginMethod});
        }

        getUserId().then(id => {
            if (__DEV__) {
                console.log("Setting user ID:", id);
            } else {
                crashlytics().setUserId(id);
                analytics().setUserId(id);
            }
        });
    } catch (e) {
        if (__DEV__) {
            console.error("Error during login event:", e);
        }
    }
}

export const logScreenEvent = (title) => {
    if (!__DEV__) {
        analytics()?.logScreenView({
            screen_name: title,
            screen_class: title
        });
    }
}

