// src/services/goodsService.js
const API_URL = 'http://localhost:8080/v1/api';

const request = async (endpoint) => {
    try {
        console.log(`${API_URL}${endpoint}`);
        const response = await fetch(`${API_URL}${endpoint}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
};

export const productService = {

    search: (params) => {
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v != null && v !== '')
        );
        const queryString = new URLSearchParams(filteredParams).toString();
        return request(`/products/search?${queryString}`);
    },

    getNew: (page = 0, size = 10) => request(`/products/new?page=${page}&size=${size}`).then(data => data.content || data),
    getDiscount: (page = 0, size = 10) => request(`/products/discount?page=${page}&size=${size}`).then(data => data.content || data),
    getBestsellers: (page = 0, size = 10) => request(`/products/bestsellers?page=${page}&size=${size}`).then(data => data.content || data),

    getByCategory: (category, page = 0, size = 3) => request(`/products/category/${category}?page=${page}&size=${size}`),

    getById: (id) => request(`/products/${id}`),

    createProduct: (productData) => {
        return request('/products', 'POST', productData);
    }
};