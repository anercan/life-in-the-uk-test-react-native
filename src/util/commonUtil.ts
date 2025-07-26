import AsyncStorage from "@react-native-async-storage/async-storage";
import {Platform} from "react-native";
import InAppReview from "react-native-in-app-review";
import {logEvent} from "util/logUtil";

export const handleReviewRequest = () => {
    try {
        checkReviewModalShown().then((reviewModalShownBefore: any) => {
            if (!reviewModalShownBefore && InAppReview.isAvailable()) {
                InAppReview.RequestInAppReview()
                    .then((hasFlowFinishedSuccessfully) => {
                        if (hasFlowFinishedSuccessfully) {
                            AsyncStorage.setItem('reviewModalShownBefore', 'true');
                            logEvent('review');
                        }
                    })
                    .catch((error) => {
                        AsyncStorage.setItem('reviewModalShownBefore', 'true');
                        logEvent('error-review-request', {errorDesc:error});
                    });
            }
        });
    } catch (e) {
        AsyncStorage.setItem('reviewModalShownBefore', 'true');
        logEvent('error-review-request');
    }
};

export const getShortenText = (title: string | undefined, number: number) => {
    if (!title) return '';
    if (title.length > number) {
        return title.slice(0, number - 3) + '...';
    }
    return title;
}

export const capitalizeWords = (str) => {
    return str
        .split(' ')
        .map((word) => {
            if (word === 'and' || word === 'And') {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1)
        })
        .join(' ');
}

export const checkFirstLaunch = async (): Promise<boolean> => {
    try {
        const value = await AsyncStorage.getItem('hasLaunched');
        if (!value && value == null) {
            await AsyncStorage.setItem('hasLaunched', 'true');
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error checking launch status:", error);
        return false;
    }
};

export const checkReviewModalShown = async (): Promise<boolean> => {
    try {
        const value = await AsyncStorage.getItem('reviewModalShownBefore');
        return !(!value && value == null);
    } catch (error) {
        return true;
    }
};

export const groupCardBackgroundImages = {
    0: require('../assets/icons/groupIcons/icon-8.png'),
    1: require('../assets/icons/groupIcons/icon-3.png'),
    2: require('../assets/icons/groupIcons/icon-2.png'),
    3: require('../assets/icons/groupIcons/icon-6.png'),
    4: require('../assets/icons/groupIcons/icon-4.png'),
    5: require('../assets/icons/groupIcons/icon-5.png'),
    6: require('../assets/icons/groupIcons/icon-8.png'),
    7: require('../assets/icons/groupIcons/icon-7.png'),
    9: require('../assets/icons/groupIcons/icon-9.png'),
    10: require('../assets/icons/groupIcons/icon-10.png'),
    11: require('../assets/icons/groupIcons/icon-11.png')
};

export const randomColors = [
    '#74808d', '#74808d',
    '#6680a1', '#6680a1',
    '#5582b3', '#5582b3',
    '#3b76b4', '#3b76b4',
];

export const getItemOfferText = (billingPeriod, formattedPrice: string | undefined) => {
    try {
        // Match duration and unit from the billingPeriod
        const regex = /P(\d+)([A-Za-z]+)/;

        const match = billingPeriod.match(regex);

        if (match) {
            const quantity = match[1]; // The number part (e.g., 3, 6, 1)
            const unit = match[2]; // The unit part (e.g., D, M, W, Y)

            // Mapping units to human-readable terms
            const unitMap = {
                D: "Day",
                W: "Week",
                M: "Month",
                Y: "Year"
            };

            // Handle pluralization (e.g., "1 day" vs "2 days")
            const unitName = unitMap[unit] || unit;

            let period = quantity === "1" ? unitName : unitName + "s";
            if(formattedPrice === 'Free' || formattedPrice === 'free') {
                return formattedPrice + ' for ' + quantity + ' ' + period;
            }

            if (quantity === '1') {
                return formattedPrice + '/' + unitName;
            } else {
                return formattedPrice + '/' + quantity + ' ' + period;
            }
        }

        return billingPeriod; // If no match, return the original period
    } catch (e) {
        return ''
    }
}

export const isFreeTrialEligible = (product) => {
    try {
        return product?.subscriptionOfferDetails[0]?.offerTags[0]?.includes('free') || product?.subscriptionOfferDetails[0]?.pricingPhases.pricingPhaseList[0]?.formattedPrice === 0;
    } catch (e) {
        return false;
    }
}

export const hexWithOpacity = (color,opacity) => {
    const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return color+alpha;
};

export const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array?.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
};

export const getColorFromPalette = (index) => {
    const colorList =
        ['#c26666', '#82cdb9', '#deba86',
        '#7ea36d', '#a97ab8', '#a7953b',
        '#529aac', '#45518d', '#2d606c',
        '#2d606c','#a5a493', '#3964b3',
        '#6aef99', '#2a2a31', '#d7d7d7'];
    return colorList[index];
}

export const isAndroid = () => {
    return Platform.OS === 'android'
}

export const getProgress = (part,total) => {
    if (part && total) {
        return Math.round((part/ total) * 100);
    }
    return '-';
}
