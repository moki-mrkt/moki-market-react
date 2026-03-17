import {privateApi, publicApi} from './api';

export const feedbackService = {

    createFeedback: async (feedbackData) => {
        const response = await privateApi.post('/feedbacks', feedbackData);
        return response.data;
    },

    getAll: async (page, size) => {

        const response = await privateApi.get('/feedbacks/all', {
            params: { page, size }
        });
        return response.data;
    },

    getUserFeedbackAboutStore: async () => {
        const response = await privateApi.get('/feedbacks/store/my');
        return response.data;
    },

    getUserFeedbackAboutProduct: async (productId) => {
        const response = await privateApi.get(`/feedbacks/products/${productId}/my`);
        return response.data;
    },


    getProductFeedbacks: async (productId, page = 0, size = 10) => {
        const response = await publicApi.get(`/feedbacks/product/${productId}?page=${page}&size=${size}`);
        return response.data;
    },

    getStoreFeedbacks: async (page = 0, size = 4) => {
        const response = await publicApi.get(`/feedbacks/store?page=${page}&size=${size}`);
        return response.data;
    },

    reply: async (id, answerText) => {

        const response = await privateApi.patch(`/feedbacks/${id}/answer`, { answer: answerText });
        return response.data;
    },

    delete: async (id) => {
        await privateApi.delete(`/feedbacks/${id}`);
    },

    update: async (id, feedbackData) => {
        const response = await privateApi.patch(`/feedbacks/${id}`, feedbackData);
        return response.data;
    }
};