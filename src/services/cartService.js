import {privateApi} from './api';

export const cartService = {
    getCart: async () => {
        const response = await privateApi.get('/cart');
        return response.data;
    },

    updateQuantity: async (productId, quantity) => {
        const response = await privateApi.put(`/cart/items/${productId}?quantity=${quantity}`);
        return response.data;
    },

    addToCart: async (productId, quantity, weight = null) => {
        let url = `/cart/items?productId=${productId}&quantity=${quantity}`;
        if (weight) url += `&weight=${weight}`;
        const response = await privateApi.post(url);
        return response.data;
    },

    removeFormCart: async (productId) => {
        const response = await privateApi.delete(`/cart/items/${productId}`);
        return response.data;
    }
};