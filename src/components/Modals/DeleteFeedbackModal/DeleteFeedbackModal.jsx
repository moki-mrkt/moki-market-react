import React from 'react';
import { useTranslation } from 'react-i18next'; // Імпорт
import './DeleteFeedbackModal.css';

const DeleteFeedbackModal = ({ isOpen, onClose, onConfirm }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <div className="delete-modal-overlay" onClick={onClose}>
            <div className="delete-modal-content" onClick={e => e.stopPropagation()}>
                <h3 className="delete-modal-title">{t('modals.delete-feedback.title')}</h3>
                <p className="delete-modal-text">
                    {t('modals.delete-feedback.text')}
                </p>

                <div className="delete-modal-buttons">
                    <button className="keep-feedback-btn modal-delete-feedback-btn" onClick={onClose}>
                        {t('modals.delete-feedback.cancel')}
                    </button>
                    <button className="confirm-delete-btn modal-delete-feedback-btn" onClick={onConfirm}>
                        {t('modals.delete-feedback.confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteFeedbackModal;