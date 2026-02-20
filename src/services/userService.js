import { publicApi } from './api';

export const userService = {
    registration: async (userCreateDTO) => {

        const response = await publicApi.post('/users/register', userCreateDTO);

        return response.status;
    },

    activate: async (token) => {
        const response = await publicApi.patch(`/users/activation?token=${token}`);

        return response.status;
    }
};
