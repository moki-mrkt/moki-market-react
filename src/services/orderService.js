import {privateApi} from './api';

export const orderService = {
    createOrder: async (orderData) => {
        const response = await privateApi.post('/orders', orderData);
        return response.data;
    },

    update: async (id, orderData) => {
        const response = await privateApi.patch(`/orders/${id}`, orderData);
        return response.data;
    },

    getById: async (id)  => {
        const response = await privateApi.get(`/orders/${id}`);
        return response.data;
    },

    getOrdersByUser: async (page, size) => {
        const response = await privateApi.get('/orders/user', {
            params: { page, size }
        });
        return response.data;
    },

    getAllOrders: async (page, size) => {

        const response = await privateApi.get('/orders', {
            params: { page, size }
        });
        return response.data;
    },

    cancelOrder: async (id) => {
        await privateApi.delete(`/orders/cancel/${id}`);
    }

};