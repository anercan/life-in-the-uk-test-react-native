import useApiCaller from "../hooks/useApiCaller";

export const useUserManagementService = (navigator?: any) => {
    const {apiCaller} = useApiCaller(navigator);

    const googleLogin = (signInRequest) => {
        return apiCaller('user-management/google-sign-in', 'POST', signInRequest)
    };

    const appleLogin = (appleSignInRequest) => {
        return apiCaller('user-management/apple-sign-in', 'POST', appleSignInRequest)
    };

    const getUserInfo = () => {
        return apiCaller('profile/get-user-info')
    }

    const getUserActivityData = () => {
        return apiCaller('profile/get-user-activity-data');
    }

    const googleSubscribe = (purchase) => {
        return apiCaller('user-management/google-play-subscribe', 'POST', purchase);
    }

    return {
        getUserActivityData,
        getUserInfo,
        googleLogin,
        appleLogin,
        googleSubscribe
    };
};
