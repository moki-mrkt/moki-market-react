import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { accountSecurity } from "../services/accountSecurity.js";
import { authService } from "../services/authService.js";

const ConfirmEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const token = searchParams.get('token');

        if (!token) {
            navigate('/', { replace: true });
            return;
        }

        const confirmChange = async () => {
            try {
                await accountSecurity.confirmEmailChange(token);

                if (authService.isAuthenticated()) authService.logoutUser();

                navigate('/?email-changed=success&login=true', { replace: true });
            } catch (error) {
                console.error('Помилка підтвердження пошти:', error);
                navigate('/?email-changed=error', { replace: true });
            }
        };

        confirmChange();
    }, [searchParams, navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h2>Підтвердження зміни пошти...</h2>
        </div>
    );
};

export default ConfirmEmail;