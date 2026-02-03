const API_URL = 'http://localhost:8080/v1/api';

const request = async (endpoint, method = 'GET', body = null, isFormData = false) => {
    const headers = {
        // Тут можна додати токен авторизації, якщо потрібно
        // 'Authorization': `Bearer ${token}`
    };

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const options = {
        method: method, headers: headers,
    };

    if (body) {
        options.body = isFormData ? body : JSON.stringify(body);
    }

    try {
        console.log(`${API_URL}${endpoint}`);
        const response = await fetch(`${API_URL}${endpoint}`, options);

        if (!response.ok) {

            const errorText = await response.text();
            throw new Error(errorText || response.statusText);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : {};

    } catch (error) {
        console.error("API Request Error:", error);
        throw error;
    }
};

export const imageService = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await request('/storage?folder=products', 'POST', formData, true);
        return response;
    },

    deleteImage: async (key) => {
        const encodedUrl = encodeURIComponent(key);
        return await request(`/storage?key=${encodedUrl}`, 'DELETE');
    }


};