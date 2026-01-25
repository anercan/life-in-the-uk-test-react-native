import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://api.quizmarkt.com/quizmarkt-base";
//const BASE_URL = 'http://192.168.1.176:9092/quizmarkt-base';

export interface ApiResponse {
    data?: any;
    status?: {
        code?: number;
        message?: string;
    };
}

const ApiCallerInternal = async (
    endpoint: string,
    method: string = "GET",
    bodyData: any = null
): Promise<ApiResponse> => {
    const url = `${BASE_URL}/${endpoint}`;

    const authToken = await AsyncStorage.getItem("authToken");
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
    }

    const options: RequestInit = {
        method,
        headers,
    };

    if (method !== "GET" && bodyData) {
        options.body = JSON.stringify(bodyData);
    }

    const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 8000)
    );

    try {
        const fetchCall = fetch(url, options);
        const response = await Promise.race([fetchCall, timeout]);
        const json = await response.json().catch(() => null);

        if (response.ok) {
            return json;
        }

        throw {
            status: response.status,
            body: json,
        };
    } catch (err) {
        console.error("API CALL FAILED:", err);
        throw err;
    }
};

export default ApiCallerInternal;
