import React from 'react';
import './SuccessOrderModal.css';

const SuccessOrderModal = ({ isOpen, onClose, orderNumber }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">

                <h2>Дякуємо за ваше замовлення!</h2>
                <p>
                    У разі необхідності будь-яких уточнень наш менеджер найближчим часом зв’яжеться з вами
                </p>

                <div className="modal-info">
                    <img className="monkey-img" src="/img/monkey.png" alt="monkey"/>

                    <img className="arm-monkey-img" src="/img/arm_monkey.png" alt="arm-monkey"/>
                </div>

                <div className="order-number-wrapper">
                    <div className="order-number">
                        <h3 className="order-number-title">Номер вашого замовлення</h3>
                        <h4 className="order-number-info">{orderNumber}</h4>
                    </div>
                </div>

                <button className="modal-btn" onClick={onClose}>
                    На головну
                </button>
            </div>
        </div>
    );
};

export default SuccessOrderModal;