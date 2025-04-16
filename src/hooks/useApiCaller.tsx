import {useContext, useState} from "react";
import {AuthContext} from "context/AuthContext";
import ApiCallerInternal, {ApiResponse} from "../util/apiCaller";

const useApiCaller = (navigator?) => {
    const {logout} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const apiCaller = async (endpoint, method = "GET", data: any = null) => {
        setLoading(true);
        try {
            const response: ApiResponse = await ApiCallerInternal(endpoint, method, data);
            if (response?.status?.code === -3 && navigator) {
                navigator?.replace('GetPremiumScreen');
            }
            return response?.data;
        } catch (error: any) {
            if (error.status === 401) {
                await logout();
            }
            console.error('API Error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {apiCaller, loading};
};

export default useApiCaller;
