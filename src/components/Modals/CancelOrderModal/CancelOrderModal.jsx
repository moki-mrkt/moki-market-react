import React from 'react';
import './CancelOrderModal.css';

const CancelOrderModal = ({ isOpen, onClose, onConfirm, orderNumber, isCanceling }) => {
    if (!isOpen) return null;

    return (

        <div className="auth-modal-overlay" onClick={onClose}>

            <div className="auth-modal-content cancel-modal-content" onClick={(e) => e.stopPropagation()}>

                <div className="auth-close-bnt">
                    <button className="close-btn-img" onClick={onClose} disabled={isCanceling}>
                        <img src="/img/cross.svg" alt="close"/>
                    </button>
                </div>

                <h2 className="cancel-modal-title" >Скасувати замовлення?</h2>

                <div className="cancel-modal-body">
                    <p className="cancel-text">Ви дійсно хочете скасувати замовлення <strong>№{orderNumber}</strong>?</p>
                    <p className="cancel-warning">Цю дію буде неможливо відмінити.</p>
                </div>

                <div className="cancel-modal-actions">
                    <button
                        className="auth-btn cancel-btn-outline"
                        onClick={onClose}
                        disabled={isCanceling}
                    >
                        Ні, залишити
                    </button>
                    <button
                        className="auth-btn cancel-btn-danger"
                        onClick={onConfirm}
                        disabled={isCanceling}
                    >
                        {isCanceling ? 'Скасування...' : 'Так, скасувати'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CancelOrderModal;