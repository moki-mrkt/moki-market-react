import axios from 'axios';

import {URLS} from '../constants/urls.js';

export const API_URL = URLS.backend_api;

export const publicApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const privateApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

privateApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const refreshTokens = async (originalRequest) => {

    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) throw new Error('No refresh token');

    const response = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken: refreshToken
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    privateApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    // processQueue(null, accessToken);

    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

    return privateApi(originalRequest);
};

privateApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {

            originalRequest._retry = true;

            try {

                return refreshTokens(originalRequest);

            } catch (refreshError) {
                localStorage.clear();

                const currentPath = window.location.pathname;

                if (currentPath.startsWith('/admin-ui')) {
                    window.location.href = '/admin-ui/login';
                } else {

                    window.location.href = '/';
                }
            }
        }

        return Promise.reject(error);
    }
);

export { privateApi };
export default publicApi;