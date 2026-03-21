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

    getUserByIdForAdmin: async (id) => {
        const response = await privateApi.get(`/users/${id}`);
        return response.data;
    },

    updateUserByAdmin: async (id, userUpdateAdminData) => {
        const response = await privateApi.patch(`/users/${id}`, userUpdateAdminData);
        return response.data;
    },

    updateProfile: async (userUpdateData) => {
        const response = await privateApi.patch('/users/profile', userUpdateData);
        return response.data;
    },

    updateAvatar: async (newImageKey) => {
        const response = await privateApi.patch('/users/profile/avatar', { imageId: newImageKey });
        return response.data;
    },

    switchBlockStatus: async (userId, isBlocked) => {
        const response = await privateApi.patch(`/users/${userId}/block-status?isBlocked=${isBlocked}`);
        return response.data;
    },

    deleteAvatar: async () => {
        const response = await privateApi.patch('/users/profile/avatar', { imageId: null });
        return response.data;
    },

    getUsers: async (query, deleted, page, size) => {
        const response = await privateApi.get('/users/all', { params: { query, deleted, page, size } });
        return response.data;
    },

    deleteUser: async () => {
        const response = await privateApi.delete('/users/profile');
        return response.data;
    }
};
