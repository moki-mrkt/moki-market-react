import React from 'react';
import { useTranslation } from 'react-i18next'; // Імпорт
import './EmailConfirmationModal.css';

const EmailConfirmationModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>

                <div className="confirm-close-btn">
                    <button className="close-btn-img" onClick={onClose}>
                        <img src="/img/cross.svg" alt="close" />
                    </button>
                </div>

                <h2 className="confirm-modal-title">
                    {t('modals.email-confirm.title-1')}<br/>{t('modals.email-confirm.title-2')}
                </h2>

                <section className="confirm-modal-section">
                    <p className="confirm-modal-text">
                        {t('modals.email-confirm.text')}
                    </p>
                </section>

                <div>
                    <button className="confirm-return-to-auth" onClick={onSwitchToLogin}>
                        {t('modals.email-confirm.back')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailConfirmationModal;