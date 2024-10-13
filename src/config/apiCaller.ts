import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = 'http://10.0.2.2:9092/quizmarkt-base';

const apiCaller = async (endpoint, method = 'GET', data = null) => {
    const url = `${BASE_URL}/${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
    };

    let authToken = await AsyncStorage.getItem('authToken');
    headers['Authorization'] = `Bearer ${authToken}`;

    const options = {
        method,
        headers,
        body: data
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url, options);
            const result = await response.json();
            //console.log(result);
            resolve(result);
        } catch (error) {
            //todo unathorize gelirse checkLoginStatus() cagrılabilir
            console.error('API Call Error:', error);
            reject(error);
        }
    });
};

export default apiCaller;
