import api from './api';

const request = async (endpoint, method = 'GET', body = null) => {
    try {

        const response = await api({
            url: endpoint,
            method: method,
            data: body
        });

        return response.data;

    } catch (error) {
        console.error("API Request Error:", error);
        if (error.response) {
            throw error.response.data;
        }
        throw error;
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

    getAllProducts: (page = 0, size = 10, query = '', sort = null) => {
        const params = new URLSearchParams();

        params.append('page', page);
        params.append('size', size);

        if (query) params.append('query', query);

        if (sort) params.append('sort', sort);

        return request(`/products?${params.toString()}`);
    },

    getById: (id) => request(`/products/${id}`),

    createProduct: (productData) => {
        return request('/products', 'POST', productData);
    },

    updateProduct: (id, productData) => {
        return request(`/products/${id}`, 'PUT', productData);
    },
    deleteProduct: (id) => request(`/products/${id}`, 'DELETE')
};