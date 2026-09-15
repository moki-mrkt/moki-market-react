import React, { useState } from 'react';
import {Link, useOutletContext} from 'react-router-dom';
import { userService } from '../../../../services/userService.js';
import { authService } from '../../../../services/authService.js';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next'; // Імпорт

import './UserInfo.css';
import {useCart} from "../../../../contexts/CartContext.jsx";

const UserInfo = () => {

    const { clearCart } = useCart();
    const { user, setUser } = useOutletContext();
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const { t } = useTranslation();

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
            newErrors.firstName = t('user-info.errors.name-empty');
        } else if (formData.firstName.length < 2 || formData.firstName.length > 64) {
            newErrors.firstName = t('user-info.errors.name-length');
        } else if (!nameRegex.test(formData.firstName)) {
            newErrors.firstName = t('user-info.errors.name-regex');
        }

        if (!formData.secondName.trim()) {
            newErrors.secondName = t('user-info.errors.surname-empty');
        } else if (formData.secondName.length < 2 || formData.secondName.length > 64) {
            newErrors.secondName = t('user-info.errors.surname-length');
        } else if (!nameRegex.test(formData.secondName)) {
            newErrors.secondName = t('user-info.errors.surname-regex');
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = t('user-info.errors.phone-empty');
        } else if (formData.phoneNumber.length > 13) {
            newErrors.phoneNumber = t('user-info.errors.phone-length');
        } else if (!phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = t('user-info.errors.phone-regex');
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error(t('user-info.errors.fix-form'));
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
            toast.success(t('user-info.success'));

        } catch (error) {
            toast.error(error.response?.data?.message || t('user-info.errors.save-error'));
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
                    <h2 className="content-title">{t('user-info.title')}</h2>
                    <button type="button" onClick={handleLogout} className="header-logout-link">
                        <img src="/img/logout.svg" className="logout-img" alt="Logout" />
                        <span className="account-link-title">{t('user-info.logout')}</span>
                    </button>
                </div>

                <h3 className="content-subtitle">{t('user-info.contact-info')}</h3>

                <div className="email-block">
                    <p className="email-text">{t('user-info.email')} {user.email}</p>
                    <Link to="/profile/security" className="email-edit-btn">
                        <img src="/img/edit-icon.svg" alt="Edit" />
                    </Link>
                </div>

                <div className="input-group">
                    <input
                        type="text"
                        name="secondName"
                        className={`account-input ${errors.secondName ? 'input-error' : ''}`}
                        placeholder={t('user-info.placeholders.surname')}
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
                        placeholder={t('user-info.placeholders.name')}
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
                        placeholder={t('user-info.placeholders.phone')}
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                    {errors.phoneNumber && <span className="error-message" style={{color: 'red', fontSize: '14px', marginTop: '5px', display: 'block'}}>{errors.phoneNumber}</span>}
                </div>

                <h3 className="content-subtitle">{t('user-info.dob-title')}</h3>

                <div className="input-group">
                    <input
                        type="date"
                        name="dateOfBirth"
                        className="account-input data-birth-input"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />
                    <p className="data-birth-text">{t('user-info.dob-hint')}</p>
                </div>

                <h3 className="content-subtitle">{t('user-info.delivery-address')}</h3>

                <div className="input-group address-group">
                    <select
                        name="deliveryType"
                        className="account-input"
                        value={formData.deliveryType}
                        onChange={handleChange}
                    >
                        <option value="">{t('user-info.placeholders.delivery-type')}</option>
                        <option value="NOVA_POSHTA">{t('user-info.placeholders.np')}</option>
                        <option value="UKR_POSHTA">{t('user-info.placeholders.up')}</option>
                    </select>
                    <input
                        type="text"
                        name="postOffice"
                        className="account-input"
                        placeholder={t('user-info.placeholders.branch')}
                        value={formData.postOffice}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group address-group">
                    <input
                        type="text"
                        name="region"
                        className="account-input"
                        placeholder={t('user-info.placeholders.region')}
                        value={formData.region}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="city"
                        className="account-input"
                        placeholder={t('user-info.placeholders.city')}
                        value={formData.city}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group address-group">
                    <input
                        type="text"
                        name="street"
                        className="account-input"
                        placeholder={t('user-info.placeholders.street')}
                        value={formData.street}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="house"
                        className="account-input"
                        placeholder={t('user-info.placeholders.house')}
                        value={formData.house}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="save-btn" disabled={isSaving}>
                    {isSaving ? t('user-info.saving') : t('user-info.save-changes')}
                </button>

            </form>
        </div>
    );
};

export default UserInfo;