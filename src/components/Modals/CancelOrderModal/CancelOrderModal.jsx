import React from 'react';
import { useTranslation } from 'react-i18next'; // Імпорт
import './CancelOrderModal.css';

const CancelOrderModal = ({ isOpen, onClose, onConfirm, orderNumber, isCanceling }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-content cancel-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="auth-close-bnt">
                    <button className="close-btn-img" onClick={onClose} disabled={isCanceling}>
                        <img src="/img/cross.svg" alt="close"/>
                    </button>
                </div>

                <h2 className="cancel-modal-title" >{t('modals.cancel-order.title')}</h2>

                <div className="cancel-modal-body">
                    <p className="cancel-text">{t('modals.cancel-order.text')} <strong>№{orderNumber}</strong>?</p>
                    <p className="cancel-warning">{t('modals.cancel-order.warning')}</p>
                </div>

                <div className="cancel-modal-actions">
                    <button
                        className="auth-btn cancel-btn-outline"
                        onClick={onClose}
                        disabled={isCanceling}
                    >
                        {t('modals.cancel-order.keep')}
                    </button>
                    <button
                        className="auth-btn cancel-btn-danger"
                        onClick={onConfirm}
                        disabled={isCanceling}
                    >
                        {isCanceling ? t('modals.cancel-order.canceling') : t('modals.cancel-order.cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelOrderModal;