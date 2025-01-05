import {useContext} from 'react';
import {AuthContext} from "../context/AuthContext";
import ApiCallerInternal from "../util/ApiCaller";

const useApiCaller = () => {
    const {logout} = useContext(AuthContext);

    const apiCaller = async (endpoint, method = 'GET', data = null) => {
        try {
            const response = await ApiCallerInternal(endpoint, method, data);
            if (response.status === 401) {
                await logout();
            }
            return response;
        } catch (error) {
            if (error.status === 401) {
                await logout();
            }
            console.error('API Error:', error);
            throw error;
        }
    };

    return {apiCaller};
};

export default useApiCaller;
