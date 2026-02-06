import api from './api';

export const orderService = {
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    update: async (id, orderData) => {
        const response = await api.patch(`/orders/${id}`, orderData);
        return response.data;
    },

    getById: async (id)  => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    getAllOrders: async (page, size) => {

        const response = await api.get('/orders', {
            params: { page, size }
        });
        return response.data;
    },

    deleteOrder: async (id) => {
        await api.delete(`/orders/cancel/${id}`);
    }
};