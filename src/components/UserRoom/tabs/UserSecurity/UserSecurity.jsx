import React, { useState } from 'react';
import { authService } from '../../../../services/authService';
import { accountSecurity } from "../../../../services/accountSecurity.js";
import toast from "react-hot-toast";
import { useNavigate, useOutletContext } from "react-router-dom";
import { userService } from "../../../../services/userService.js";
import DeleteUserModal from "../../../Modals/DeleteUserModal/DeleteUserModal.jsx";
import { useModal } from "../../../../contexts/ModalContext.jsx";
import { useTranslation } from 'react-i18next'; // Імпорт

import '../UserInfo/UserInfo.css';
import '../UserSecurity/UserSecurity.css';

const UserSecurity = () => {

    const navigate = useNavigate();
    const { openLogin } = useModal();
    const user = useOutletContext().user;
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const { t } = useTranslation(); // Ініціалізація хука

    const [emailChangeSentTo, setEmailChangeSentTo] = useState(null);

    const [showEmailCurrentPassword, setShowEmailCurrentPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [newEmailFormData, setNewEmailFormData] = useState({
        newEmail: '',
        emailCurrentPassword: ''
    });

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    const emailRegex = /^.+@.+\..+$/;

    const validateEmailForm = () => {
        const newErrors = {};

        if (!newEmailFormData.newEmail.trim()) {
            newErrors.newEmail = t('user-security.errors.email-empty');
        } else if (!emailRegex.test(newEmailFormData.newEmail)) {
            newErrors.newEmail = t('user-security.errors.email-invalid');
        }

        if (!newEmailFormData.emailCurrentPassword) {
            newErrors.emailCurrentPassword = t('user-security.errors.pass-empty');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = t('user-security.errors.pass-empty');
        }

        if (!formData.newPassword) {
            newErrors.newPassword = t('user-security.errors.new-pass-empty');
        } else if (!passwordRegex.test(formData.newPassword)) {
            newErrors.newPassword = t('user-security.errors.new-pass-regex');
        }

        if (!formData.confirmNewPassword) {
            newErrors.confirmNewPassword = t('user-security.errors.confirm-empty');
        } else if (formData.newPassword !== formData.confirmNewPassword) {
            newErrors.confirmNewPassword = t('user-security.errors.mismatch');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEmailChange = (e) => {
        const { name, value } = e.target;
        setNewEmailFormData({ ...newEmailFormData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleChangeUpdatePassword = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handlePasswordChangeSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error(t('user-security.errors.fix-form'));
            return;
        }

        setIsSaving(true);

        try {

            const payload = {
                currentPassword: formData.currentPassword,
                password: formData.newPassword,
                confirmPassword: formData.confirmNewPassword
            };

            await accountSecurity.updatePassword(payload);

            toast.success(t('user-security.success.pass-updated'));

            authService.logoutUser(true, true);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.data?.message === "Wrong password") {
                toast.error(t('user-security.errors.wrong-pass'));
            } else {
                toast.error(t('user-security.errors.save-error'));
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmitEmailChange = async (e) => {
        e.preventDefault();

        if (!validateEmailForm()) {
            toast.error(t('user-security.errors.fix-form'));
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                newEmail: newEmailFormData.newEmail,
                currentPassword: newEmailFormData.emailCurrentPassword
            };

            await accountSecurity.updateEmail(payload);

            setEmailChangeSentTo(newEmailFormData.newEmail);

            setNewEmailFormData(prev => ({ ...prev, emailCurrentPassword: '' }));
        } catch (error) {
            const errorDetail = error.response?.data?.detail || error.response?.data?.message;

            if (error.response?.status === 401 || errorDetail === "Wrong password") {
                toast.error(t('user-security.errors.wrong-pass'));
            } else if (errorDetail === "Email already taken") {
                toast.error(t('user-security.errors.email-taken'));
            } else {
                toast.error(errorDetail || t('user-security.errors.req-error'));
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsSaving(true);
        try {
            await userService.deleteUser();
            toast.success(t('user-security.success.deleted'));
            authService.logoutUser();
        } catch (error) {
            toast.error(t('user-security.errors.del-error'));
        } finally {
            setIsSaving(false);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <>
            {emailChangeSentTo ? (

                <div className="account-tab active email-success-block">
                    <h2 className="content-title security-title email-change-title">{t('user-security.check-email')}</h2>

                    <div className="email-success-content">

                        <p className="email-success-text">
                            {t('user-security.email-sent')}<br/>
                            <span className="highlight-email">{emailChangeSentTo}</span>
                        </p>

                        <p className="email-success-hint">
                            {t('user-security.email-hint')}
                        </p>

                        <button
                            type="button"
                            className="save-btn return-btn"
                            onClick={() => setEmailChangeSentTo(null)}
                        >
                            {t('user-security.send-another')}
                        </button>
                    </div>
                </div>

            ) : (

                <form className="account-tab active email-form" onSubmit={handleSubmitEmailChange}>

                    <h2 className="content-title security-title email-change-title">{t('user-security.title-email')}</h2>

                    <div className="email-block">
                        <p className="email-text">{t('user-security.current-email')} {user.email}</p>
                    </div>

                    <div className="input-group email-change-input">
                        <input
                            type="email"
                            name="newEmail"
                            className="account-input"
                            placeholder={t('user-security.placeholders.new-email')}
                            value={newEmailFormData.newEmail}
                            onChange={handleEmailChange}
                            autoComplete="new-password"
                        />
                        {errors.newEmail && <span className="security-error-style" style={{display: 'block', marginTop: '5px'}}>{errors.newEmail}</span>}
                    </div>

                    <div className="input-group">
                        <div className="security-password-wrapper">
                            <input
                                type={showEmailCurrentPassword ? "text" : "password"}
                                name="emailCurrentPassword"
                                className="account-input"
                                placeholder={t('user-security.placeholders.current-pass')}
                                value={newEmailFormData.emailCurrentPassword}
                                onChange={handleEmailChange}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="security-password-toggle-btn"
                                onClick={() => setShowEmailCurrentPassword(!showEmailCurrentPassword)}
                            >
                                <img src={showEmailCurrentPassword ? "/img/eye-off.svg" : "/img/eye.svg"} alt="toggle visibility" />
                            </button>
                        </div>
                        {errors.emailCurrentPassword && <span className="security-error-style" style={{display: 'block', marginTop: '5px'}}>{errors.emailCurrentPassword}</span>}
                    </div>

                    <button type="submit" className="save-btn" disabled={isSaving}>
                        {isSaving ? t('user-security.saving') : t('user-security.change-email-btn')}
                    </button>
                </form>

            )}

            <form className="account-tab active" onSubmit={handlePasswordChangeSubmit}>
                <div className="content-header">
                    <h2 className="content-title security-title">{t('user-security.title-pass')}</h2>
                </div>

                <div className="security-modal-info-block">
                    <h3 className="security-modal-info">{t('user-security.pass-req-title')}</h3>

                    <p className="security-modal-text">
                        {t('user-security.pass-req-desc')}
                    </p>
                </div>

                <div className="input-group">
                    <div className="security-password-wrapper">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            name="currentPassword"
                            className="account-input"
                            placeholder={t('user-security.placeholders.current-pass')}
                            value={formData.currentPassword}
                            onChange={handleChangeUpdatePassword}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            className="security-password-toggle-btn"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                            <img src={showCurrentPassword ? "/img/eye-off.svg" : "/img/eye.svg"} alt="toggle visibility"/>
                        </button>
                    </div>
                    {errors.currentPassword && <span className="security-error-style">{errors.currentPassword}</span>}
                </div>

                <div className="input-group">
                    <div className="security-password-wrapper">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            className="account-input"
                            placeholder={t('user-security.placeholders.new-pass')}
                            value={formData.newPassword}
                            onChange={handleChangeUpdatePassword}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            className="security-password-toggle-btn"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            <img src={showNewPassword ? "/img/eye-off.svg" : "/img/eye.svg"} alt="toggle visibility"/>
                        </button>
                    </div>
                    {errors.newPassword && <span className="security-error-style">{errors.newPassword}</span>}
                </div>

                <div className="input-group">
                    <div className="security-password-wrapper">
                        <input
                            type= {showConfirmPassword ? "text" : "password"}
                            name="confirmNewPassword"
                            className="account-input"
                            placeholder={t('user-security.placeholders.confirm-pass')}
                            value={formData.confirmNewPassword}
                            onChange={handleChangeUpdatePassword}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            className="security-password-toggle-btn"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <img src={showConfirmPassword ? "/img/eye-off.svg" : "/img/eye.svg"} alt="toggle visibility"/>
                        </button>
                    </div>
                    {errors.confirmNewPassword && <span className="security-error-style">{errors.confirmNewPassword}</span>}
                </div>

                <button type="submit" className="save-btn" disabled={isSaving}>
                    {isSaving ? t('user-security.saving') : t('user-security.change-pass-btn')}
                </button>
            </form>

            <div className="account-tab active delete-account-block">
                <h2 className="content-title">{t('user-security.danger-zone')}</h2>

                <p className="security-modal-text delete-user-text">
                    {t('user-security.danger-desc')}
                </p>

                <button
                    type="button"
                    className="save-btn delete-account-btn"
                    onClick={() => setIsDeleteModalOpen(true)}
                    disabled={isSaving}
                    style={{
                        backgroundColor: '#DC2626',
                        border: 'none',
                        marginTop: '15px'
                    }}
                >
                    {isSaving ? t('user-security.deleting') : t('user-security.delete-account')}
                </button>
            </div>

            <DeleteUserModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
            />
        </>
    );
};

export default UserSecurity;