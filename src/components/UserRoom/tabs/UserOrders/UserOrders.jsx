// src/components/UserRoom/tabs/UserOrders.jsx
import React, { useState } from 'react';

import './UserOrders.css';

const UserOrders = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Мокові дані для прикладу
    const orders = [
        { id: 125, date: '18.11.2025', status: 'В обробці', total: 1350 },
        { id: 126, date: '19.11.2025', status: 'Виконано', total: 500 },
    ];

    if (selectedOrder) {
        // --- VIEW: ДЕТАЛІ ЗАМОВЛЕННЯ ---
        return (
            <div id="order-details-view">
                <div className="details-main-card">
                    <div className="details-header">
                        <div className="back-link-and-status">
                            <button className="back-link" onClick={() => setSelectedOrder(null)}>
                                <img src="/img/left-arrow.svg" alt="Back" style={{ height: '16px' }} />
                                Назад до списку
                            </button>
                            <div className="status-block">{selectedOrder.status}</div>
                        </div>
                        <h2 className="content-title">Подробиці замовлення №{selectedOrder.id}</h2>
                    </div>

                    <div className="details-list">
                        <div className="details-row header-row">
                            <span>Товар</span>
                            <span>Загалом</span>
                        </div>
                        {/* Приклад товару */}
                        <div className="details-row">
                            <span>Дубайський шоколад Coral 100г ×5</span>
                            <span className="price-text">1200 грн</span>
                        </div>
                        <hr className="details-divider" />
                        <div className="details-summary">
                            <div className="summary-row">
                                <span>Спосіб оплати:</span>
                                <span className="highlight">Онлайн оплата</span>
                            </div>
                            <div className="summary-row" style={{ marginBottom: 0 }}>
                                <span className="total">Всього:</span>
                                <span className="highlight">{selectedOrder.total} грн</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Блок адреси */}
                <div className="address-card">
                    <h3 className="content-title" style={{fontSize: '24px', marginBottom: '20px'}}>Адреса доставка</h3>
                    <div className="address-info">
                        <p className="user-name-small">Тетяна Петрівна Павлова</p>
                        <p>Поштомат "Нова Пошта" №1234: вул. Квіткова, 32</p>
                        <p>Харків</p>
                        <p>Харківська</p>
                    </div>
                </div>
            </div>
        );
    }

    // --- VIEW: СПИСОК ЗАМОВЛЕНЬ ---
    return (
        <div id="orders-list-view">
            <h2 className="content-title" style={{ marginBottom: '30px' }}>Мої замовлення</h2>
            <div className="orders-table-wrapper">
                <table className="orders-table">
                    <thead>
                    <tr>
                        <th>Замовлення</th>
                        <th>Дата</th>
                        <th className="status-processing">Статус</th>
                        <th>Загалом дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>№ {order.id}</td>
                            <td>{order.date}</td>
                            <td className="status-processing">{order.status}</td>
                            <td>
                                <button
                                    className="view-link"
                                    onClick={() => setSelectedOrder(order)}
                                    style={{background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', textDecoration: 'underline'}}
                                >
                                    Перегляд
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserOrders;