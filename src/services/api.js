import axios from 'axios';

import {URLS} from '../constants/urls.js';

export const API_URL = URLS.backend_api;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
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

    if (!refreshToken) {
        throw new Error('No refresh token');
    }

    const response = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken: refreshToken
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

    return api(originalRequest);
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {

            originalRequest._retry = true;

            try {

                return refreshTokens(originalRequest);

            } catch (refreshError) {

                console.error("Session expired", refreshError);
                localStorage.clear();

                const currentPath = window.location.pathname;

                if (currentPath.startsWith('/admin-ui')) {
                    window.location.href = '/admin-ui/login';
                } else {

                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;