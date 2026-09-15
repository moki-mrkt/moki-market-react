import React, { useState } from 'react';
import { userService } from '../../../services/userService';
import { useTranslation } from 'react-i18next'; // Імпорт
import './RegistrationModal.css';

const RegistrationModal = ({ isOpen, onClose, onSwitchToLogin, onSuccess }) => {
    if (!isOpen) return null;

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '+380',
        password: '',
        passwordConfirm: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        if (!value.startsWith('+380')) {
            setFormData(prev => ({ ...prev, phone: '+380' }));
            return;
        }
        if (!/^\d*$/.test(value.slice(1))) return;
        if (value.length > 13) return;
        setFormData(prev => ({ ...prev, phone: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        const { firstName, lastName, email, phone, password, passwordConfirm } = formData;
        const nameRegex = /^[A-ZА-ЯІЇЄҐ][a-zа-яіїєґA-ZА-ЯІЇЄҐ'ʼ’\s-]+$/;

        if (!firstName || firstName.length < 2 || firstName.length > 64) {
            newErrors.firstName = t('modals.reg.errors.name-len');
        } else if (!nameRegex.test(firstName)) {
            newErrors.firstName = t('modals.reg.errors.name-regex');
        }

        if (!lastName || lastName.length < 2 || lastName.length > 64) {
            newErrors.lastName = t('modals.reg.errors.surname-len');
        } else if (!nameRegex.test(lastName)) {
            newErrors.lastName = t('modals.reg.errors.surname-regex');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            newErrors.email = t('modals.reg.errors.email-invalid');
        }

        const phoneRegex = /^\+[0-9]+$/;
        if (!phone) {
            newErrors.phone = t('modals.reg.errors.phone-empty');
        } else if (phone.length > 13) {
            newErrors.phone = t('modals.reg.errors.phone-len');
        } else if (!phoneRegex.test(phone)) {
            newErrors.phone = t('modals.reg.errors.phone-regex');
        }

        const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
        if (!password) {
            newErrors.password = t('modals.reg.errors.pass-empty');
        } else if (!passwordRegex.test(password)) {
            newErrors.password = t('modals.reg.errors.pass-regex');
        }

        if (password !== passwordConfirm) {
            newErrors.passwordConfirm = t('modals.reg.errors.pass-mismatch');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (!isAgreed) return;

        setLoading(true);
        setGlobalError('');

        try {
            const payload = {
                firstName: formData.firstName,
                secondName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phone,
                password: formData.password,
                confirmPassword: formData.passwordConfirm
            };
            await userService.registration(payload);
            onSuccess();
        } catch (err) {
            if (err.response && err.response.status === 400 && err.response.statusText === 'Email already taken') {
                setGlobalError(t('modals.reg.errors.email-taken'));
            } else {
                setGlobalError(t('modals.reg.errors.submit-err'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="reg-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="auth-close-bnt">
                    <button className="reg-close-btn-img" onClick={onClose}>
                        <img src="/img/cross.svg" alt="close"/>
                    </button>
                </div>

                <h2 className="reg-modal-title">{t('modals.reg.title')}</h2>

                <form className="reg-form" onSubmit={handleSubmit}>
                    <section className="reg-form-section">
                        <div className="reg-row-inputs" >
                            <div className="inputWrapperStyle">
                                <input
                                    name="firstName"
                                    type="text"
                                    className="reg-checkout-input"
                                    placeholder={t('modals.reg.name')}
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                                {errors.firstName && <span className="errorStyle">{errors.firstName}</span>}
                            </div>
                            <div className="inputWrapperStyle">
                                <input
                                    name="lastName"
                                    type="text"
                                    className={`reg-checkout-input ${errors.lastName ? 'input-error' : ''}`}
                                    placeholder={t('modals.reg.surname')}
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                                {errors.lastName && <span className="errorStyle">{errors.lastName}</span>}
                            </div>
                        </div>

                        <div className="reg-row-inputs">
                            <div className="inputWrapperStyle">
                                <input
                                    name="email"
                                    type="email"
                                    className={`reg-checkout-input ${errors.email ? 'input-error' : ''}`}
                                    placeholder={t('modals.reg.email')}
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <span className="errorStyle">{errors.email}</span>}
                            </div>
                            <div className="inputWrapperStyle">
                                <input
                                    name="phone"
                                    type="tel"
                                    className={`reg-checkout-input ${errors.phone ? 'input-error' : ''}`}
                                    placeholder={t('modals.reg.phone')}
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                />
                                {errors.phone && <span className="errorStyle">{errors.phone}</span>}
                            </div>
                        </div>

                        <div className="reg-row-inputs reg-password-wrapper">
                            <div className="inputWrapperStyle">
                                <div style={{position: 'relative', width: '100%'}}>
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        className={`reg-checkout-input ${errors.password ? 'input-error' : ''}`}
                                        placeholder={t('modals.reg.pass')}
                                        value={formData.password}
                                        onChange={handleChange}
                                        style={{width: '100%'}}
                                    />
                                    <button
                                        type="button"
                                        className="reg-password-toggle-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{top: '50%', transform: 'translateY(-50%)'}}
                                    >
                                        <img src={showPassword ? "/img/eye-off.svg" : "/img/eye.svg"} alt="toggle visibility"/>
                                    </button>
                                </div>
                                {errors.password && <span className="errorStyle">{errors.password}</span>}
                            </div>
                        </div>

                        <div className="reg-row-inputs reg-password-wrapper">
                            <div className="inputWrapperStyle">
                                <div style={{position: 'relative', width: '100%'}}>
                                    <input
                                        name="passwordConfirm"
                                        type={showConfirmPassword ? "text" : "password"}
                                        className={`reg-checkout-input ${errors.passwordConfirm ? 'input-error' : ''}`}
                                        placeholder={t('modals.reg.pass-confirm')}
                                        value={formData.passwordConfirm}
                                        onChange={handleChange}
                                        style={{width: '100%'}}
                                    />
                                    <button
                                        type="button"
                                        className="reg-password-toggle-btn"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{top: '50%', transform: 'translateY(-50%)'}}
                                    >
                                        <img src={showConfirmPassword ? "/img/eye-off.svg" : "/img/eye.svg"} alt="toggle visibility"/>
                                    </button>
                                </div>
                                {errors.passwordConfirm && <span className="errorStyle">{errors.passwordConfirm}</span>}
                            </div>
                        </div>

                        {globalError && <div style={{color: 'red', marginBottom: '15px', fontSize: '18px'}}>{globalError}</div>}

                        <div className="reg-modal-info-block">
                            <h3 className="reg-modal-info">{t('modals.reg.pass-req-title')}</h3>
                            <p className="reg-modal-text">
                                {t('modals.reg.pass-req-text')}
                            </p>
                        </div>

                        <div className="agreement-wrapper">
                            <label className="custom-checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={isAgreed}
                                    onChange={(e) => setIsAgreed(e.target.checked)}
                                    required
                                />
                                <span className="checkmark-reg"></span>
                                <span className="agreement-text">
                                   {t('modals.reg.agreement-1')}
                                    <a href="/info/terms" target="_blank">{t('modals.reg.agreement-2')}</a>
                                </span>
                            </label>
                        </div>

                        <div className="reg-btn-wrapper">
                            <button
                                className={`reg-btn ${!isAgreed ? 'disabled' : ''}`}
                                type="submit"
                                disabled={loading || !isAgreed}>
                                {loading ? t('modals.reg.processing') : t('modals.reg.submit')}
                            </button>
                        </div>
                    </section>
                </form>

                <div>
                    <button className="return-to-auth" onClick={onSwitchToLogin}>
                        {t('modals.reg.back')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationModal;