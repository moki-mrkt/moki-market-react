import React from 'react';
import './EmailConfirmationModal.css';

const EmailConfirmationModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    if (!isOpen) return null;

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>

                <div className="confirm-close-btn">
                    <button className="close-btn-img" onClick={onClose}>
                        <img src="/img/cross.svg" alt="close" />
                    </button>
                </div>

                <h2 className="confirm-modal-title">Підтвердження<br/>електронної пошти</h2>

                <section className="confirm-modal-section">
                    <p className="confirm-modal-text">
                        На вказану вами електронну пошту було надіслано листа з підтвердженням реєстрації.
                        Будь ласка, перевірте вашу поштову скриньку.
                    </p>
                </section>

                <div>
                    <button className="confirm-return-to-auth" onClick={onSwitchToLogin}>
                        Повернутись до авторизації
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EmailConfirmationModal;