import React, {useState} from 'react';

import {accountSecurity}  from "../../../services/accountSecurity.js";

import './ForgotPasswordModal.css';
import toast from "react-hot-toast";
import {authService} from "../../../services/authService.js";

const ForgotPasswordModal = ({ isOpen, onClose, onSwitchToLogin, onSuccess }) => {
    if(!isOpen) return null;

    const [step, setStep] = useState('EMAIL');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resetToken, setResetToken] = useState('');

    const [emailForForgotPassword,  setEmailForForgotPassword] = useState({email: ''});
    const [verifyOtpDTO, setVerifyOtpDTO] = useState({otpCode: '', email: ''});
    const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleEmailChange = (e) => {
        setEmailForForgotPassword({ ...emailForForgotPassword, [e.target.name]: e.target.value });
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setVerifyOtpDTO({ ...verifyOtpDTO, otpCode: value });
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await accountSecurity.initiateForgotPassword(emailForForgotPassword);
            setVerifyOtpDTO({ ...verifyOtpDTO, email: emailForForgotPassword.email });
            setStep('OTP');
        } catch (err) {

            let errorStr = 'Виникла помилка';

            if (err.status === 400) errorStr = 'Перевірте пошту';

            toast.error(errorStr, {
                duration: 4000,
                position: 'top-right',
                style: {
                    paddingLeft: '25px',
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await accountSecurity.verifyOtpAndGetResetToken(verifyOtpDTO);
            setResetToken(response.resetToken);
            setStep('NEW_PASSWORD');
        } catch (err) {

            console.log('1:' + err.response.data.detail)

            let errorStr = 'Невірний код. Спробуйте ще раз.';

            const backendMessage = err.response?.data?.detail;

            if (backendMessage === 'OTP code has expired') {
                errorStr = 'Час дії коду вичерпано. Будь ласка, запитайте новий код.';
            }

            toast.error(errorStr, {
                duration: 4000,
                position: 'top-right',
                style: {
                    paddingLeft: '25px',
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwords.password !== passwords.confirmPassword) {
            toast.error('Паролі не співпадають!', {
                duration: 4000,
                position: 'top-right',
                style: {
                    paddingLeft: '25px',
                }
            });
            return;
        }
        setLoading(true);
        setError('');
        try {
            // Використовуйте свій метод для відправки паролів.
            await accountSecurity.confirmPasswordReset(passwords, resetToken);

            toast.success('Паролі успішно змінені!', {
                duration: 4000,
                position: 'top-right',
                style: {
                    paddingLeft: '25px',
                }
            });

            authService.logoutUser(true);
        } catch (err) {
            toast.error('Виникла помилка. Спробуйте ще раз.', {
                duration: 4000,
                position: 'top-right',
                style: {
                    paddingLeft: '25px',
                }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className={`forgot-modal-content ${step === 'OTP' ? 'otp-style' : ''}`} onClick={(e) => e.stopPropagation()}>

                <div className="forgot-close-bnt">
                    <button className="close-btn-img" onClick={onClose}>
                        <img  src="/img/cross.svg" alt="close"/>
                    </button>
                </div>

                {step === 'EMAIL' && (
                    <div>
                        <h2 className="forgot-modal-title">Змінити пароль</h2>
                        <form className="forgot-form" onSubmit={handleEmailSubmit}>
                            <section className="forgot-form-section">
                                <p className="forgot-modal-text">
                                    Введіть Вашу електронну пошту, куди буде надіслано код для зміни пароля.
                                </p>
                                <div className="forgot-input-group">
                                    <input
                                        name="email"
                                        type="email"
                                        className="forgot-checkout-input"
                                        placeholder="Пошта"
                                        value={emailForForgotPassword.email}
                                        onChange={handleEmailChange}
                                    />
                                </div>
                                {error && <p className="error-text">{error}</p>}
                                <div className="forgot-btn-wrapper">
                                    <button className="forgot-btn" type="submit" disabled={loading}>
                                        {loading ? 'Обробка...' : 'Відправити'}
                                    </button>
                                </div>
                            </section>
                        </form>
                        <div>
                            <button className="forgot-return-to-auth" onClick={onSwitchToLogin}>
                                Повернутись до авторизації
                            </button>
                        </div>
                    </div>
                )}

                {step === 'OTP' && (
                    <div className="otp-step-wrapper">
                        <h2 className="forgot-modal-title">Відновлення паролю</h2>
                        <form className="forgot-form" onSubmit={handleOtpSubmit}>
                            <section className="forgot-form-section">
                            <p className="forgot-modal-text">
                                Введіть код, який був надісланий на вашу пошту: {verifyOtpDTO.email}
                            </p>
                            <input
                                type="text"
                                maxLength="6"
                                className="forgot-checkout-input otp-code-input"
                                placeholder="XXXXXX"
                                value={verifyOtpDTO.otpCode}
                                onChange={handleOtpChange}
                            />
                            {error && <p className="error-text">{error}</p>}
                            <button className="forgot-btn" type="submit" disabled={loading}>
                                {loading ? 'Обробка...' : 'Підтвердити'}
                            </button>
                            </section>
                        </form>
                        <button className="forgot-return-to-auth" onClick={onSwitchToLogin}>
                            Повернутись до авторизації
                        </button>
                    </div>
                )}

                {step === 'NEW_PASSWORD' && (
                    <>
                        <h2 className="forgot-modal-title">Новий пароль</h2>
                        <form className="forgot-form" onSubmit={handlePasswordSubmit}>
                            <section className="forgot-form-section">
                                <p className="forgot-modal-text">
                                    Введіть новий пароль для вашого облікового запису. <br/>
                                    <span className="forgot-about-pass-modal-text">
                                       *Тільки латинські літери та символи. Мінімальна довжина поля 8 символів. Обовʼязково 1 цифра, 1 велика та 1 мала літера.
                                    </span>
                                </p>

                                <div className="forgot-input-group password-wrapper">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        className="forgot-checkout-input"
                                        placeholder="Новий пароль"
                                        value={passwords.password}
                                        onChange={handlePasswordChange}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <img src={showPassword ? "/img/eye-off.svg" : "/img/eye.svg"} alt="toggle visibility"/>
                                    </button>
                                </div>

                                <div className="forgot-input-group password-wrapper">
                                    <input
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="forgot-checkout-input"
                                        placeholder="Підтвердження пароля"
                                        value={passwords.confirmPassword}
                                        onChange={handlePasswordChange}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <img src={showConfirmPassword ? "/img/eye-off.svg" : "/img/eye.svg"} alt="toggle visibility"/>
                                    </button>
                                </div>
                                {error && <p className="error-text">{error}</p>}
                                <div className="forgot-btn-wrapper">
                                    <button
                                        className="forgot-btn"
                                        type="submit" disabled={loading}>
                                        {loading ? 'Обробка...' : 'Зберегти'}
                                    </button>
                                </div>

                            </section>
                        </form>

                        <div>
                            <button className="forgot-return-to-auth" onClick={onSwitchToLogin}>
                                Повернутись до авторизації
                            </button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}

export default ForgotPasswordModal;