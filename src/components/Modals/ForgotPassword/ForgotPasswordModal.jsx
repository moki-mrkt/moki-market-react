import React, {useState} from 'react';

import './ForgotPasswordModal.css';

const ForgotPasswordModal = ({ isOpen, onClose, onSwitchToLogin, onSuccess }) => {
    if(!isOpen) return null;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [emailForForgotPassword,  setEmailForForgotPassword] = useState({email: ''});

    const handleChange = (e) => {
        setEmailForForgotPassword({ ...emailForForgotPassword, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log(emailForForgotPassword);

            onClose();
        } catch (err) {
            setError('Невірний email або пароль');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="forgot-modal-content" onClick={(e) => e.stopPropagation()}>

                <div className="forgot-close-bnt">
                    <button className="close-btn-img" onClick={onClose}>
                        <img  src="/img/cross.svg" alt="close"/>
                    </button>
                </div>

                <h2 className="forgot-modal-title">Змінити пароль</h2>

                <form className="forgot-form" onSubmit={handleSubmit}>
                    <section className="forgot-form-section">
                        <p className="forgot-modal-text">
                            Введіть Вашу електронну пошту, куди буде надіслоно код для зміни пароля.
                        </p>

                        <div className="forgot-input-group">
                            <input
                                name="email"
                                type="email"
                                id="email"
                                className="forgot-checkout-input"
                                placeholder="Пошта"
                                value={emailForForgotPassword.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="forgot-btn-wrapper">
                            <button
                                className="forgot-btn"
                                type="submit">
                                {loading ? 'Обробка...' : 'Відправити'}
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
}

export default ForgotPasswordModal;