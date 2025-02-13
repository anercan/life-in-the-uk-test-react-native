import {useContext, useState} from "react";
import {AuthContext} from "context/AuthContext";
import ApiCallerInternal from "../util/ApiCaller";

const useApiCaller = () => {
    const {logout} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const apiCaller = async (endpoint, method = "GET", data: any = null) => {
        setLoading(true);
        try {
            const response: any = await ApiCallerInternal(endpoint, method, data);
            if (response.status === 401) {
                await logout();
            }
            return response;
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
