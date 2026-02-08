import React, { useState } from 'react';
import { authService } from '../../../services/authService';

import './RegistrationModal.css';



const RegistrationModal = ({ isOpen, onClose, onSwitchToLogin, onSuccess }) => {
    if (!isOpen) return null;

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        passwordConfirm: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAgreed) return;
        setLoading(true);
        setError('');

        try {
            // Тут має бути ваш метод реєстрації в authService
            // const response = await authService.register(formData);
            console.log('Registering:', formData);

            // Імітація успішної реєстрації (замініть на реальний виклик)
            // onSuccess(response);
            onClose();
        } catch (err) {
            setError('Помилка реєстрації. Перевірте дані.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="reg-modal-content" onClick={(e) => e.stopPropagation()}>

                <div className="auth-close-bnt">
                    <button className="close-btn" onClick={onClose}>
                        <img src="/img/cross.svg" alt="close"/>
                    </button>
                </div>

                <h2 className="reg-modal-title">Створити аккаунт</h2>

                <form className="reg-form" onSubmit={handleSubmit}>

                    <section className="reg-form-section">

                        <div className="reg-row-inputs" >
                            <input
                                name="firstName"
                                type="text"
                                className="reg-checkout-input"
                                placeholder="Ім'я"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                            <input
                                name="lastName"
                                type="text"
                                className="reg-checkout-input"
                                placeholder="Прізвище"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                            {/* Телефон */}
                            <div className="reg-row-inputs">

                                <input
                                    name="email"
                                    type="email"
                                    className="reg-checkout-input"
                                    placeholder="Пошта"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                                <input
                                    name="phone"
                                    type="tel"
                                    className="reg-checkout-input"
                                    placeholder="Телефон"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        {/* Пароль */}
                        <div className="reg-row-inputs reg-password-wrapper">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className="reg-checkout-input"
                                placeholder="Пароль"
                                value={formData.password}
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

                        <div className="reg-row-inputs reg-password-wrapper">
                            <input
                                name="passwordConfirm"
                                type={showConfirmPassword ? "text" : "password"}
                                className="reg-checkout-input"
                                placeholder="Підтвердження пароля"
                                value={formData.passwordConfirm}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <img src={showConfirmPassword ? "/img/eye-off.svg" : "/img/eye.svg"} alt="toggle visibility"/>
                            </button>
                        </div>

                        {error && <div style={{color: 'red', marginBottom: '15px', fontSize: '18px'}}>{error}</div>}

                        <div className="reg-modal-info-block">
                            <h3 className="reg-modal-info">Пароль має включати:</h3>

                            <p className="reg-modal-text">
                                Тільки латинські літери. Мінімальна довжина поля 8 символів.
                            </p>
                        </div>

                        <div className="agreement-wrapper">
                            <label className="custom-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={isAgreed}
                                    onChange={(e) => setIsAgreed(e.target.checked)}
                                    required
                                />
                                <span className="checkmark"></span>
                                <span className="agreement-text">
                                   Підтверджуючи реєстрацію, я приймаю умови
                                    <a href="/info/terms" target="_blank">користувацікої угоди</a>
                                </span>
                            </label>
                        </div>


                        <div className="reg-btn-wrapper">
                            <button
                                className={`reg-btn ${!isAgreed ? 'disabled' : ''}`}
                                type="submit"
                                disabled={loading || !isAgreed}>
                                {loading ? 'Обробка...' : 'Зареєструватися'}
                            </button>
                        </div>


                    </section>
                </form>

                <div>
                    <button className="return-to-auth" onClick={onSwitchToLogin}>
                        Повернутись до авторизації
                    </button>
                </div>

            </div>
        </div>
    );
};

export default RegistrationModal;