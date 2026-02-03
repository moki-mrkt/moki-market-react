const API_URL = 'http://localhost:8080/v1/api';

const request = async (endpoint) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`);
        if (!response.ok) throw new Error(response.statusText);
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const feedbackService = {
    // Запит на отримання відгуків про магазин
    getStoreFeedbacks: (page = 0, size = 4) => request(`/feedbacks/store?page=${page}&size=${size}`)
};