import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = 'http://192.168.1.47:8082/quesmarkt-base';

const apiCaller = (endpoint, method = 'GET', data = null) => {
    const url = `${BASE_URL}/${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
    };

    AsyncStorage.getItem('authToken')
        .then((authToken) => {
            if (authToken) {
                headers['Authorization'] = `Bearer ${authToken}`;
            }
        })
        .catch((error) => {
            console.error('Error retrieving auth token from AsyncStorage:', error);
        });

    const options = {
        method,
        headers,
        body:data
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);
            resolve(result);
        } catch (error) {
            console.error('API Call Error:', error.message);
            reject(error);
        }
    });
};

export default apiCaller;
