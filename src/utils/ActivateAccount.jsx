import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {userService} from "../services/userService.js"; // або ваш authService

const ActivateAccount = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const hasFetched = useRef(false); // Захист від подвійного виклику в React 18 Strict Mode

    useEffect(() => {
        // Щоб запит не відправлявся двічі в режимі розробки
        if (hasFetched.current) return;
        hasFetched.current = true;

        const token = searchParams.get('token');

        if (!token) {
            navigate('/', { replace: true });
            return;
        }

        const activateUser = async () => {
            try {

                await userService.activate(token);

                navigate('/?activation=success', { replace: true });

            } catch (error) {
                console.error('Помилка активації:', error);
                navigate('/?activation=error', { replace: true });
            }
        };

        activateUser();
    }, [searchParams, navigate]);
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h2>Перевірка токена...</h2>
        </div>
    );
};

export default ActivateAccount;