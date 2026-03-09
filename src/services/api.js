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

let isRefreshing = false;
let failedQueue = [];


const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

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

    const response = await axios.post(`${API_URL}/auth/refresh`, {refreshToken: refreshToken});

    const newAccessToken = response.data.accessToken;

    // Зберігаємо нові токени
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);

    // Оновлюємо заголовок поточного запиту
    privateApi.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
    originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;

    // Виконуємо всі запити, які чекали в черзі
    processQueue(null, newAccessToken);

    return privateApi(originalRequest);
};

privateApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {

            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return privateApi(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                return await refreshTokens(originalRequest);

            } catch (refreshError) {

                processQueue(refreshError, null);
                localStorage.clear();

                const currentPath = window.location.pathname;

                if (currentPath.startsWith('/admin-ui')) {
                    window.location.href = '/admin-ui/login';
                } else {
                    window.location.href = '/';
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export { privateApi };
export default publicApi;