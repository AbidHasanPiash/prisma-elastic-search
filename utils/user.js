import appConfig from '@/configs/appConfig';
import apiConfig from '@/configs/apiConfig';
import { postData } from '@/utils/axios';
import { deleteCookie, getCookie, hasCookie, setCookie } from 'cookies-next';
import { toast } from "sonner";

// Function to Login
const login = async data => {
    try {
        const response = await postData(apiConfig?.LOGIN, data);
        const { token } = response;
        if (token) setCookie(appConfig?.CurrentUserToken, token, { path: '/' })
        console.log(response);
        console.log(token);
        
        return response;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            throw new Error('An server error occurred during login.');
        }
    }
};

// Function to Signup
const signup = async data => {
    try {
        const response = await postData(apiConfig?.SIGNUP, data);
        const { token } = response;
        if (token) setCookie(appConfig?.CurrentUserToken, token, { path: '/' })

        return response;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            throw new Error('An server error occurred during login.');
        }
    }
};

// Function to logout user
const logout = (direct = false) => {
    if (direct) {
        try {
            deleteCookie(appConfig?.CurrentUserToken, { path: '/' });
            deleteCookie(appConfig?.CurrentUserRefToken, { path: '/' });
            window.location.replace("/auth/login");
        } catch (error) {
            console.error('Error during logout:', error);
            throw new Error('Error during logout:', error)
        }
    }
    else {
        toast.warning('Do you want to Sign out ?', {
            action: {
                label: 'Yes',
                onClick: () => {
                    try {
                        deleteCookie(appConfig?.CurrentUserToken, { path: '/' });
                        deleteCookie(appConfig?.CurrentUserRefToken, { path: '/' });
                        deleteCookie(appConfig?.CUP, { path: '/' });
                        window.location.replace("/auth/login");
                    } catch (error) {
                        console.error('Error during logout:', error);
                        throw new Error('Error during logout:', error)
                    }
                }
            },
        })
    }
};

// Function to get JWT token from cookies
const getToken = () => {
    try {
        const token = getCookie(appConfig?.CurrentUserToken);
        return token || null;
    } catch (error) {
        console.error('Error getting token from cookie:', error);
        return null;
    }
};

// Function to get JWT SecretKey from cookies
const getRefreshToken = () => {
    try {
        const token = getCookie(appConfig?.CurrentUserRefToken);
        return token ? token : null;
    } catch (error) {
        console.error('Error getting token from cookie:', error);
        return null;
    }
};

// Function to set JWT Refresh Token to cookies
const setNewToken = (newToken) => {
    if (newToken) {
        setCookie(appConfig?.CurrentUserToken, newToken, { path: '/' });
    }
};

// Function to check if user is logged in
const isLoggedIn = () => {
    const token = hasCookie(App.CurrentUserToken);
    return token;
};

export default {
    login,
    signup,
    logout,
    getToken,
    getRefreshToken,
    setNewToken,
    isLoggedIn,

}