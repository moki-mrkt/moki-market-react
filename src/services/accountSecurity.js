import { publicApi, privateApi } from './api';

export const accountSecurity = {
    activate: async (token) => {
        const response = await publicApi.post(`/users/activation?token=${token}`);

        return response.status;
    },

    updatePassword: async (updatePasswordDTO) => {
        const response = await privateApi.patch('/users/profile/password', updatePasswordDTO);
        return response.data;
    },

    updateEmail: async (updateEmailDTO) => {
        const response = await privateApi.patch('/users/profile/email', updateEmailDTO);
        return response.data;
    },

    confirmEmailChange: async (emailChangeToken) => {
        const response = await publicApi.post(`/users/profile/email/confirm?token=${emailChangeToken}`);
        return response.data;
    },

    initiateForgotPassword: async (verifyEmailDTO)  => {
        const response = await publicApi.post('/users/password-reset/initiate', verifyEmailDTO);
        return response.data;
    },

    verifyOtpAndGetResetToken: async (verifyOtpDTO) => {
        const response = await publicApi.post('/users/password-reset/verify', verifyOtpDTO);
        return response.data;
    },

    confirmPasswordReset: async (passwordResetDTO, resetTokenJwt) => {
        const response = await privateApi.post(
            '/users/password-reset/confirm',
            passwordResetDTO,
            {
                headers: {
                    Authorization: `Bearer ${resetTokenJwt}`
                }
            }
        );
        return response.data;
    }

};