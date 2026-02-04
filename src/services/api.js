import axios from 'axios';

export const API_URL = 'http://localhost:8080/v1/api'; // Ваша адреса бекенду

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 1. Request Interceptor: Додає Access Token до кожного запиту
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

// 2. Response Interceptor: Обробляє помилку 401 (Unauthorized)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Якщо помилка 401 і ми ще не пробували оновити токен
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                // Робимо запит на оновлення токена
                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refreshToken: refreshToken
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                // Зберігаємо нові токени
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                // Оновлюємо заголовок і повторюємо оригінальний запит
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                return api(originalRequest);

            } catch (refreshError) {
                // Якщо Refresh токен теж прострочений — повний вихід
                console.error("Session expired", refreshError);
                localStorage.clear();
                window.location.href = '/login'; // Редірект на логін
            }
        }

        return Promise.reject(error);
    }
);

export default api;