import React, { useState } from 'react';
import { authService } from '../../../../services/authService';

import {accountSecurity} from "../../../../services/accountSecurity.js";
import toast from "react-hot-toast";

import '../UserInfo/UserInfo.css';
import '../UserSecurity/UserSecurity.css';

import {useNavigate, useOutletContext} from "react-router-dom";
import {userService} from "../../../../services/userService.js";
import DeleteUserModal from "../../../Modals/DeleteUserModal/DeleteUserModal.jsx";
import {useModal} from "../../../../contexts/ModalContext.jsx";

const UserSecurity = () => {

  const navigate = useNavigate();
  const { openLogin } = useModal();
  const user = useOutletContext().user;
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

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
            newErrors.newEmail = "Нова пошта не може бути порожньою";
        } else if (!emailRegex.test(newEmailFormData.newEmail)) {
            newErrors.newEmail = "Введіть коректну електронну адресу";
        }

        if (!newEmailFormData.emailCurrentPassword) {
            newErrors.emailCurrentPassword = "Поточний пароль не може бути порожнім";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = "Поточний пароль не може бути порожнім";
        }

        if (!formData.newPassword) {
            newErrors.newPassword = "Новий пароль не може бути порожнім";
        } else if (!passwordRegex.test(formData.newPassword)) {
            newErrors.newPassword = "Пароль має містити від 8 до 20 символів, велику та малу літеру латинського алфавіту і цифру";
        }

        if (!formData.confirmNewPassword) {
            newErrors.confirmNewPassword = "Підтвердіть новий пароль";
        } else if (formData.newPassword !== formData.confirmNewPassword) {
            newErrors.confirmNewPassword = "Паролі не збігаються";
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
            toast.error("Будь ласка, виправте помилки у формі");
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

            toast.success('Пароль успішно оновлено!');

            authService.logoutUser(true, true);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.data?.message === "Wrong password") {
                toast.error("Невірний поточний пароль");
            } else {
                toast.error('Помилка при збереженні');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmitEmailChange = async (e) => {
        e.preventDefault();

        if (!validateEmailForm()) {
            toast.error("Будь ласка, виправте помилки у формі");
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
                toast.error("Невірний поточний пароль");
            } else if (errorDetail === "Email already taken") {
                toast.error("Ця електронна пошта вже використовується");
            } else {
                toast.error(errorDetail || "Помилка при відправці запиту");
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
            setIsSaving(true);
            try {
                await userService.deleteUser();
                toast.success('Ваш акаунт успішно видалено');
                authService.logoutUser();
            } catch (error) {
                toast.error("Не вдалося видалити акаунт. Спробуйте пізніше.");
            } finally {
                setIsSaving(false);
                setIsDeleteModalOpen(false);
            }
    };

    return (
  <>
      {emailChangeSentTo ? (

          <div className="account-tab active email-success-block">
              <h2 className="content-title security-title email-change-title">Перевірте вашу пошту</h2>

              <div className="email-success-content">

                  <p className="email-success-text">
                      Ми надіслали лист із посиланням для підтвердження на адресу:<br/>
                      <span className="highlight-email">{emailChangeSentTo}</span>
                  </p>

                  <p className="email-success-hint">
                      Будь ласка, перейдіть за посиланням у листі, щоб завершити зміну пошти.
                      Якщо листа немає у "Вхідних", перевірте папку <b>"Спам"</b>.
                  </p>

                  <button
                      type="button"
                      className="save-btn return-btn"
                      onClick={() => setEmailChangeSentTo(null)}
                  >
                      Відправити інший E-mail
                  </button>
              </div>
          </div>

      ) : (

          <form className="account-tab active email-form" onSubmit={handleSubmitEmailChange}>

              <h2 className="content-title security-title email-change-title">Зміна пошти</h2>

              <div className="email-block">
                  <p className="email-text">Поточна пошта: {user.email}</p>
              </div>

              <div className="input-group email-change-input">
                  <input
                      type="email"
                      name="newEmail"
                      className="account-input"
                      placeholder="Новий E-mail"
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
                          placeholder="Поточний пароль"
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
                  {isSaving ? 'Збереження...' : 'Змінити пошту'}
              </button>
          </form>

      )}

    <form className="account-tab active" onSubmit={handlePasswordChangeSubmit}>
        <div className="content-header">
            <h2 className="content-title security-title">Зміна паролю</h2>
        </div>

        <div className="security-modal-info-block">
            <h3 className="security-modal-info">Пароль має включати:</h3>

            <p className="security-modal-text">
                Тільки латинські літери та символи. Мінімальна довжина поля 8 символів. Обовʼязково 1 цифра, 1 велика та 1 мала літера.
            </p>
        </div>

        <div className="input-group">
            <div className="security-password-wrapper">
                <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    className="account-input"
                    placeholder="Поточний пароль"
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
                    placeholder="Новий пароль"
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
                    placeholder="Введіть новий пароль ще раз"
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
            {isSaving ? 'Збереження...' : 'Змінити пароль'}
        </button>
    </form>

      <div className="account-tab active delete-account-block">
          <h2 className="content-title">Небезпечна зона</h2>

          <p className="security-modal-text delete-user-text">
              Після видалення акаунта ви більше не зможете отримати доступ до своїх замовлень, бонусів та налаштувань профілю <strong>Moki</strong>.
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
              {isSaving ? 'Видалення...' : 'Видалити акаунт'}
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