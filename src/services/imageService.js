import {privateApi} from './api';

const request = async (endpoint, method = 'GET', body = null, isFormData = false) => {
    const config = {
        url: endpoint,
        method: method,
        data: body,
        headers: {}
    };

    if (isFormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
    }

    try {
        const response = await privateApi(config);
        return response.data;
    } catch (error) {
        console.error("API Request Error:", error);

        if (error.response) {
            throw error.response.data || new Error(error.response.statusText);
        }
        throw error;
    }
};

export const imageService = {
    uploadImage: async (folder, file) => {
        const formData = new FormData();
        formData.append('file', file);

        return await request('/storage?folder=' + folder, 'POST', formData, true);
    },

    deleteImage: async (key) => {
        const encodedUrl = encodeURIComponent(key);
        return await request(`/storage?key=${encodedUrl}`, 'DELETE');
    }
};