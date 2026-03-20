import React from 'react';
import '../DeleteFeedbackModal/DeleteFeedbackModal.css';

const DeleteUserModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="delete-modal-overlay" onClick={onClose}>
            <div className="delete-modal-content" onClick={e => e.stopPropagation()}>
                <h3 className="delete-modal-title">Видалити акаунт?</h3>
                <p className="delete-modal-text">
                    Ви впевнені, що хочете видалити свій акаунт? Цю дію неможливо відмінити,
                    а всі ваші дані та історія замовлень будуть остаточно втрачені.
                </p>

                <div className="delete-modal-buttons">
                    <button className="keep-feedback-btn modal-delete-feedback-btn" onClick={onClose}>
                        Скасувати
                    </button>
                    <button className="confirm-delete-btn modal-delete-feedback-btn" onClick={onConfirm}>
                        Видалити акаунт
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserModal;