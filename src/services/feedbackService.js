import api from './api';

export const feedbackService = {
    getAll: async (page, size) => {
        // Припускаємо, що endpoint виглядає так
        const response = await api.get('/feedbacks/all', {
            params: { page, size }
        });
        return response.data;
    },

    getStoreFeedbacks: async (page = 0, size = 4) => {
        const response = await api.get(`/feedbacks/store?page=${page}&size=${size}`);
        return response.data;
    },

    reply: async (id, answerText) => {

        const response = await api.patch(`/feedbacks/${id}/answer`, { answer: answerText });
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/feedbacks/${id}`);
    }
};