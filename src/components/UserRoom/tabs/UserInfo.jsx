// src/components/UserRoom/tabs/UserInfo.jsx
import React, { useState } from 'react';

const UserInfo = () => {
    // Стан для форми
    const [formData, setFormData] = useState({
        surname: '',
        name: '',
        phone: '',
        email: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Saved:', formData);
        // Тут виклик API для збереження
    };

    return (
        <form className="account-form account-tab active" onSubmit={handleSubmit}>
            <div className="content-header">
                <h2 className="content-title">Особисті дані</h2>
                <button type="button" className="header-logout-link" style={{border: 'none', background: 'none', cursor: 'pointer'}}>
                    <img src="/img/logout.svg" className="logout-img" alt="Logout" />
                    <span className="logout-link-title">Вийти з кабінету</span>
                </button>
            </div>

            <h3 className="content-subtitle">Контактна інформація</h3>

            <div className="input-group">
                <input
                    type="text"
                    name="surname"
                    className="account-input"
                    placeholder="Прізвище"
                    value={formData.surname}
                    onChange={handleChange}
                />
            </div>

            <div className="input-group">
                <input
                    type="text"
                    name="name"
                    className="account-input"
                    placeholder="Ім'я"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>

            <div className="input-group">
                <input
                    type="tel"
                    name="phone"
                    className="account-input"
                    placeholder="Телефон"
                    value={formData.phone}
                    onChange={handleChange}
                />
            </div>

            <div className="input-group">
                <input
                    type="email"
                    name="email"
                    className="account-input"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>

            <button type="submit" className="save-btn">Зберегти зміни</button>
        </form>
    );
};

export default UserInfo;