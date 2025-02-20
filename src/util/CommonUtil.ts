import AsyncStorage from "@react-native-async-storage/async-storage";

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

export const getBillingPeriod = (billingPeriod) => {
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
            if (quantity === '1') {
                return unitName
            } else {
                return quantity + ' ' + period;
            }
        }

        return billingPeriod; // If no match, return the original period
    } catch (e) {
        return ''
    }
}

export const isFreeTrialEligible = (product) => {
    try {
        return product?.subscriptionOfferDetails[0]?.offerTags[0]?.includes('free-trial') || product?.subscriptionOfferDetails[0]?.pricingPhases.pricingPhaseList[0]?.formattedPrice === 0;
    } catch (e) {
        return false;
    }
}
