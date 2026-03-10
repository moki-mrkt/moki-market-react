import React, { useState } from 'react';
import {Link, useOutletContext} from 'react-router-dom';
import { userService } from '../../../../services/userService.js';
import { authService } from '../../../../services/authService.js';
import { cartService } from '../../../../services/cartService.js';
import toast from 'react-hot-toast';

import './UserInfo.css';
import {useCart} from "../../../../contexts/CartContext.jsx";

const UserInfo = () => {

    const { clearCart } = useCart();
    const { user, setUser } = useOutletContext();
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        secondName: user?.secondName || '',
        phoneNumber: user?.phoneNumber || '',
        dateOfBirth: user?.dateOfBirth || '',

        region: user?.deliveryInfo?.region || '',
        city: user?.deliveryInfo?.city || '',
        postOffice: user?.deliveryInfo?.postOffice || '',
        street: user?.deliveryInfo?.street || '',
        house: user?.deliveryInfo?.house || '',
        deliveryType: user?.deliveryInfo?.deliveryType || ''
    });

    const nameRegex = /^[A-ZА-ЩЬЮЯЄІЇҐЁЭЫЪ][a-zа-щьюяєіїґA-ZА-ЩЬЮЯЄІЇҐёэыъA-ZА-ЯЁЭЫЪ'ʼ’\s-]+$/;
    const phoneRegex = /^\+[0-9]+$/;

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = "Ім'я не може бути порожнім";
        } else if (formData.firstName.length < 2 || formData.firstName.length > 64) {
            newErrors.firstName = "Ім'я має містити від 2 до 64 символів";
        } else if (!nameRegex.test(formData.firstName)) {
            newErrors.firstName = "Ім'я повинно починатися з великої літери та містити лише допустимі букви";
        }

        if (!formData.secondName.trim()) {
            newErrors.secondName = "Прізвище не може бути порожнім";
        } else if (formData.secondName.length < 2 || formData.secondName.length > 64) {
            newErrors.secondName = "Прізвище має містити від 2 до 64 символів";
        } else if (!nameRegex.test(formData.secondName)) {
            newErrors.secondName = "Прізвище повинно починатися з великої літери та містити лише допустимі букви";
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "Номер телефону не може бути порожнім";
        } else if (formData.phoneNumber.length > 13) {
            newErrors.phoneNumber = "Номер телефону не може бути довшим за 13 символів";
        } else if (!phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Номер телефону має починатися з '+' та містити лише цифри";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handlePostOfficeChange = (e) => {
        const value = e.target.value;

        if (!value.startsWith('№ ')) {
            setFormData(prev => ({ ...prev, postOffice: '№ ' }));
            return;
        }

        setFormData(prev => ({ ...prev, postOffice: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Будь ласка, виправте помилки у формі");
            return;
        }

        setIsSaving(true);

        try {

            const payload = {
                firstName: formData.firstName.trim(),
                secondName: formData.secondName.trim(),
                phoneNumber: formData.phoneNumber.trim(),
                dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth : null,

                deliveryInfo: {
                    region: formData.region,
                    city: formData.city,
                    postOffice: formData.postOffice,
                    street: formData.street,
                    house: formData.house,
                    deliveryType: formData.deliveryType ? formData.deliveryType : null
                }
            };

            const updatedUser = await userService.updateProfile(payload);

            setUser(updatedUser);
            toast.success('Дані успішно оновлено!');

        } catch (error) {
            toast.error(error.response?.data?.message || 'Помилка при збереженні');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        authService.logoutUser();
        clearCart();
        localStorage.removeItem('guest_cart');
    };

    return (
        <div className="user-info-tab">
            <form className="account-form account-tab active" onSubmit={handleSubmit}>
                <div className="content-header">
                    <h2 className="content-title">Особисті дані</h2>
                    <button type="button" onClick={handleLogout} className="header-logout-link">
                        <img src="/img/logout.svg" className="logout-img" alt="Logout" />
                        <span className="account-link-title">Вийти з кабінету</span>
                    </button>
                </div>

                <h3 className="content-subtitle">Контактна інформація</h3>

                <div className="email-block">
                    <p className="email-text">Пошта: {user.email}</p>
                    <Link to="/profile/security" className="email-edit-btn">
                        <img src="/img/edit-icon.svg" alt="Edit" />
                    </Link>
                </div>

                <div className="input-group">
                    <input
                        type="text"
                        name="secondName"
                        className={`account-input ${errors.secondName ? 'input-error' : ''}`}
                        placeholder="Прізвище"
                        value={formData.secondName}
                        onChange={handleChange}
                    />
                    {errors.secondName && <span className="error-message" style={{color: 'red', fontSize: '14px', marginTop: '5px', display: 'block'}}>{errors.secondName}</span>}
                </div>

                <div className="input-group">
                    <input
                        type="text"
                        name="firstName"
                        className={`account-input ${errors.firstName ? 'input-error' : ''}`}
                        placeholder="Ім'я"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    {errors.firstName && <span className="error-message" style={{color: 'red', fontSize: '14px', marginTop: '5px', display: 'block'}}>{errors.firstName}</span>}
                </div>

                <div className="input-group">
                    <input
                        type="tel"
                        name="phoneNumber"
                        className={`account-input ${errors.phoneNumber ? 'input-error' : ''}`}
                        placeholder="Телефон (+380...)"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                    {errors.phoneNumber && <span className="error-message" style={{color: 'red', fontSize: '14px', marginTop: '5px', display: 'block'}}>{errors.phoneNumber}</span>}
                </div>

                <h3 className="content-subtitle">Дата народження</h3>

                <div className="input-group">
                    <input
                        type="date"
                        name="dateOfBirth"
                        className="account-input data-birth-input"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />
                    <p className="data-birth-text">*Дата народження потрібна, щоб в нас була можливість надсилати вам подарунки та найкращі акційні пропозиції ;)</p>
                </div>

                <h3 className="content-subtitle">Адреса доставки</h3>

                <div className="input-group address-group">
                    <select
                        name="deliveryType"
                        className="account-input"
                        value={formData.deliveryType}
                        onChange={handleChange}
                    >
                        <option value="">Оберіть тип доставки</option>
                        <option value="NOVA_POSHTA">Нова Пошта</option>
                        <option value="UKR_POSHTA">Укрпошта</option>
                    </select>
                    <input
                        type="text"
                        name="postOffice"
                        className="account-input"
                        placeholder="Відділення пошти"
                        value={formData.postOffice}
                        onChange={handlePostOfficeChange}
                    />
                </div>

                <div className="input-group address-group">
                    <input
                        type="text"
                        name="region"
                        className="account-input"
                        placeholder="Область"
                        value={formData.region}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="city"
                        className="account-input"
                        placeholder="Населений пункт"
                        value={formData.city}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group address-group">
                    <input
                        type="text"
                        name="street"
                        className="account-input"
                        placeholder="Вулиця"
                        value={formData.street}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="house"
                        className="account-input"
                        placeholder="Номер вулиці"
                        value={formData.house}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="save-btn" disabled={isSaving}>
                    {isSaving ? 'Збереження...' : 'Зберегти зміни'}
                </button>

            </form>
        </div>
    );
};

export default UserInfo;