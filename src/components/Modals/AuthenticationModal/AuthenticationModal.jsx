import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { authService } from '../../../services/authService';

import './AuthenticationModal.css';

const AuthenticationModal = ({ isOpen, onClose, onSuccess }) => {
    if (!isOpen) return null;

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log(credentials);
            const response = await authService.login(credentials.email, credentials.password);
            onSuccess(response);
            onClose();
        } catch (err) {
            setError('Невірний email або пароль');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>

                <div className="auth-close-bnt">
                    <button className="close-btn" onClick={onClose}>
                        <img  src="/img/cross.svg" alt="close"/>
                    </button>
                </div>

                <h2 className="auth-modal-title">Увійти</h2>

                <form className="auth-form" onSubmit={handleSubmit}>


                    <section className="auth-form-section">

                        <div className="input-group user-info-input">
                            <input
                                name="email"
                                type="email"
                                id="email"
                                className="auth-checkout-input"
                                placeholder="Пошта"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group user-info-input password-wrapper">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="auth-checkout-input"
                                placeholder="Пароль"
                                value={credentials.password}
                                onChange={handleChange}
                                required
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
                    <button className="registration-btn" >
                        Створити аккаунт
                    </button>
                </div>


                <Link to={"/catalog"} className="forgot-password">
                        Забули пароль?
                </Link>
            </div>
        </div>
    );
};

export default AuthenticationModal;