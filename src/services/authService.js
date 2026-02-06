import api from './api';

export const authService = {
    // Логін
    login: async (email, password) => {

        console.log("Api: " + email + " " + password)
        const response = await api.post('/auth/login', { email, password });

        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return response.data;
    },

    logoutUser: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        window.location.href = '/';
    },

    logoutAdmin: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/admin-ui/login';
    },

    // Перевірка, чи ми залогінені (проста перевірка наявності токена)
    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken');
    }
};