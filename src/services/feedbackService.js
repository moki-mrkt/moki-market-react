import {privateApi, publicApi} from './api';

export const feedbackService = {
    getAll: async (page, size) => {

        const response = await privateApi.get('/feedbacks/all', {
            params: { page, size }
        });
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
    }
};