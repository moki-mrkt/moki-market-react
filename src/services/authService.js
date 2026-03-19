import { publicApi } from './api';

export const authService = {

    login: async (email, password) => {

        const response = await publicApi.post('/auth/login', { email, password });

        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        }

        return response.data;
    },

    logoutUser: (openLoginAfter = false) => {

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        if (openLoginAfter) {
            window.location.href = '/?login=true';
        } else {
            window.location.href = '/';
        }
    },

    logoutAdmin: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/admin-ui/login';
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken') || !!localStorage.getItem('refreshToken');    }
};