import {SubscriptionOffer} from "react-native-iap";

export const SUBSCRIPTION_SKUS = ['level1'];

export const isFreeTrialEligible = (offer:SubscriptionOffer) => {
    // iOS: check paymentMode
    if (offer?.paymentMode === 'free-trial') return true;
    // Android: check pricing phases
    const phases = offer?.pricingPhasesAndroid?.pricingPhaseList;
    if (!phases || phases.length <= 1) return false;
    return phases[0]?.priceAmountMicros === '0';
}

export const getItemOfferText = (billingPeriod, formattedPrice: string | undefined, priceAmountMicros: string | undefined) => {
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

            if(priceAmountMicros == "0" ) { // burası her dil için free textini dönmüyo ('Ücretsiz' vs dönüyor)
                return 'Free for ' + quantity + ' ' + period;
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
