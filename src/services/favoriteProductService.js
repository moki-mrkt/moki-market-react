import {privateApi} from './api';

export const favoriteProductService = {

    getUserFavorites: async (page, size) => {
        const response = await privateApi.get(`/favorites/user?page=${page}&size=${size}`);
        return response.data;
    },

    addFavorite: async (productId) => {
        const response = await privateApi.post(`/favorites/${productId}`);
        return response.status;
    },

    removeFavorite: async (productId) => {
        const response = await privateApi.delete(`/favorites/${productId}`);
        return response.status;
    }
};