import { useContext, useState } from "react";
import { AuthContext } from "context/AuthContext";
import ApiCallerInternal, { ApiResponse } from "../util/apiCaller";

const useApiCaller = (navigator?: any) => {
    const { logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const apiCaller = async (
        endpoint: string,
        method: string = "GET",
        data: any = null
    ) => {
        setLoading(true);

        try {
            const response: ApiResponse = await ApiCallerInternal(
                endpoint,
                method,
                data
            );

            if (response?.status?.code === -3 && navigator) {
                navigator.replace("SubscriptionScreen");
            }

            return response?.data;
        } catch (error: any) {

            const httpCode = error?.status;

            if (httpCode === 401) {
                await logout();
            }

            throw error?.body || error;
        } finally {
            setLoading(false);
        }
    };

    return { apiCaller, loading };
};

export default useApiCaller;
