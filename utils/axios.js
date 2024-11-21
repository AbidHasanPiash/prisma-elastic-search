import axios from 'axios';
import user from '@/utils/user';
import apiConfig from '@/configs/apiConfig';
import { toast } from 'sonner';

const axiosInstance = axios.create({
    baseURL: apiConfig?.BASE_URL,
    timeout: 15000,
    headers: {
        // 'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = user.getToken();
        // Set the Authorization header with Bearer token format
        config.headers['Authorization'] = token ? `Bearer ${token}` : '';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const getMessageFromResponse = (response) => {
    if (response?.data?.message) {
        return response.data.message;
    }

    // Fallback if the "message" field is not present
    return "No response from server";
};

export const handleAxiosError = (error) => {
    if (error.response) {
        const code = error.response.status;
        // Handle the case when the detail field is an array
        const errorMessage = error.response?.data?.data?.message || error.response?.data?.message;
        
        if (code === 401) {
            user.logout(true);
        }
        
        if (code === 404) {
            toast.warning(`No Data: ${code} - ${errorMessage}`);
            return null
        }

        toast.error(`Server error: ${code} - ${errorMessage}`);
    } else if (error.request) {
        toast.error('Network error: No response received from server.');
    } else {
        toast.error('Axios error: ' + error.message);
    }
    throw error; // Propagate the error for handling in calling code if necessary
};

export const handleAxiosErrorAsServer = (error) => {
    if (error.response) {
        const code = error.response.status;
        const errorMessage = error.response?.data?.message;

        if (code === 404) {
            console.warn(`Resource not found (404): ${errorMessage || 'No additional message'}`);
            return null;  // Return null or a default value if data is missing
        } else {
            console.error(`Server error: ${code} - ${errorMessage}`);
            return null;
        }
    } else if (error.request) {
        console.error('Network error: No response received from server.');
    } else {
        console.error('Axios error: ' + error.message);
    }

    // For other errors, we can still throw to propagate if necessary
    throw error;
};

export async function fetchData(endpoint) {
    try {
        const response = await axiosInstance.get(endpoint);
        return response?.data?.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function fetchDataAsServer(endpoint) {
    try {
        const response = await axiosInstance.get(endpoint);
        return response?.data?.data;
    } catch (error) {
        handleAxiosErrorAsServer(error);
    }
}

export async function postData(endpoint, data, isFileRequest = false) {
    try {
        const isFormData = data instanceof FormData;
        const requestData = isFormData ? data : JSON.stringify({ ...data });

        const headers = isFormData
            ? { 'Content-Type': 'multipart/form-data' }
            : { 'Content-Type': 'application/json' };

        // If the request is for a file, we set the responseType to 'blob'
        const config = isFileRequest ? { headers, responseType: 'blob' } : { headers };

        const response = await axiosInstance.post(endpoint, requestData, config);

        // If it's a file request, we don't return a success toast, just return the file
        if (isFileRequest) {
            return response.data; // This will be the Blob
        }

        const message = getMessageFromResponse(response);
        toast.success(message);
        return response?.data?.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function updateData(endpoint, data) {
    try {
        const isFormData = data instanceof FormData;
        const requestData = isFormData ? data : JSON.stringify({ ...data });

        const headers = isFormData
            ? { 'Content-Type': 'multipart/form-data' }
            : { 'Content-Type': 'application/json' };
        
        const response = await axiosInstance.patch(endpoint, requestData, { headers });
        
        const message = getMessageFromResponse(response);
        toast.success(message);
        return response?.data?.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function deleteData(endpoint, id) {
    const url = endpoint + id;
    try {
        const response = await axiosInstance.delete(url);

        const message = getMessageFromResponse(response);
        toast.success(message);
        return response?.data?.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

// Initial token refresh
// refreshToken();
// setInterval(refreshToken, 4 * 60 * 1000);

export default axiosInstance;