import React from 'react';
import { useTranslation } from 'react-i18next'; // Імпорт
import './SuccessOrderModal.css';

const SuccessOrderModal = ({ isOpen, onClose, orderNumber }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">

                <h2>{t('modals.success-order.title')}</h2>
                <p>
                    {t('modals.success-order.text')}
                </p>

                <div className="modal-info">
                    <img className="monkey-img" src="/img/monkey.png" alt="monkey"/>
                    <img className="arm-monkey-img" src="/img/arm_monkey.png" alt="arm-monkey"/>
                </div>

                <div className="order-number-wrapper">
                    <div className="order-number">
                        <h3 className="order-number-title">{t('modals.success-order.order-num')}</h3>
                        <h4 className="order-number-info">{orderNumber}</h4>
                    </div>
                </div>

                <button className="modal-btn" onClick={onClose}>
                    {t('modals.success-order.home')}
                </button>
            </div>
        </div>
    );
};

export default SuccessOrderModal;