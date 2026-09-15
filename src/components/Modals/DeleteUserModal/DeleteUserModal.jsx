import React from 'react';
import { useTranslation } from 'react-i18next'; // Імпорт
import '../DeleteFeedbackModal/DeleteFeedbackModal.css';

const DeleteUserModal = ({ isOpen, onClose, onConfirm }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <div className="delete-modal-overlay" onClick={onClose}>
            <div className="delete-modal-content" onClick={e => e.stopPropagation()}>
                <h3 className="delete-modal-title">{t('modals.delete-user.title')}</h3>
                <p className="delete-modal-text">
                    {t('modals.delete-user.text')}
                </p>

                <div className="delete-modal-buttons">
                    <button className="keep-feedback-btn modal-delete-feedback-btn" onClick={onClose}>
                        {t('modals.delete-user.cancel')}
                    </button>
                    <button className="confirm-delete-btn modal-delete-feedback-btn" onClick={onConfirm}>
                        {t('modals.delete-user.confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserModal;