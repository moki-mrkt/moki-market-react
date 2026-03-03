import React, {useEffect, useState} from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { authService } from '../../../services/authService';

import './AuthenticationModal.css';
// import '../../../styles/PasswordTogle.css';

const AuthenticationModal = ({ isOpen, onClose, onSuccess, onSwitchToRegister, onSwitchToForgotPassword}) => {

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (!isOpen) {
            setCredentials({ email: '', password: '' });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await authService.login(credentials.email, credentials.password);
            onSuccess(response);
            onClose();
        } catch (err) {

            if (err.response && err.response.status === 401) {
                toast.error('Невірна пошта або пароль', {
                    duration: 4000,
                    position: 'top-right',
                    style: {
                        paddingLeft: '25px',
                    }
                });
            } else {
                toast.error('Помилка авторизації',{
                    duration: 4000,
                    position: 'top-right',
                    style: {
                        width: '300px',
                    }
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>

                <div className="auth-close-bnt">
                    <button className="close-btn-img" onClick={onClose}>
                        <img  src="/img/cross.svg" alt="close"/>
                    </button>
                </div>

                <h2 className="auth-modal-title">Увійти</h2>

                <form className="auth-form" onSubmit={handleSubmit}>

                    <section className="auth-form-section">

                        <div className="auth-input-group">
                            <input
                                name="email"
                                type="email"
                                id="email"
                                className="auth-checkout-input"
                                placeholder="Пошта"
                                value={credentials.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="auth-input-group password-wrapper">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="auth-checkout-input"
                                placeholder="Пароль"
                                value={credentials.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <img src={showPassword ? "/img/eye-off.svg" : "/img/eye.svg"} alt="toggle visibility"/>
                            </button>
                        </div>
                        <button className="auth-btn" >
                            Увійти
                        </button>

                    </section>
                </form>

                <div>
                    <button className="registration-btn" onClick={onSwitchToRegister}>
                        Створити аккаунт
                    </button>
                </div>


                <div>
                    <button className="forgot-password" onClick={onSwitchToForgotPassword}>
                        Забули пароль?
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthenticationModal;