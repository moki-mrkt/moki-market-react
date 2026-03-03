import { publicApi, privateApi } from './api';

export const userService = {
    registration: async (userCreateDTO) => {

        const response = await publicApi.post('/users/register', userCreateDTO);

        return response.status;
    },

    getProfile: async () => {
        const response = await privateApi.get('/users/profile');
        return response.data;
    },

    updateProfile: async (userData) => {
        const response = await privateApi.patch('/users/profile', userData);
        return response.data;
    },

    updateAvatar: async (newImageKey) => {
        const response = await privateApi.patch('/users/profile/avatar', { imageId: newImageKey });
        return response.data;
    },

    deleteAvatar: async () => {
        const response = await privateApi.patch('/users/profile/avatar', { imageId: null });
        return response.data;
    }
};
