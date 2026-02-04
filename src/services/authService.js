import api from './api';

export const authService = {
    // Логін
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });

        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return response.data;
    },

    // Вихід
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    },

    // Перевірка, чи ми залогінені (проста перевірка наявності токена)
    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken');
    }
};