import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Імпортуємо всі модалки
import AuthenticationModal from "../components/Modals/AuthenticationModal/AuthenticationModal";
import RegistrationModal from "../components/Modals/RegistrationModal/RegistrationModal";
import ForgotPassword from "../components/Modals/ForgotPassword/ForgotPasswordModal.jsx";
import EmailConfirmationModal from "../components/Modals/EmailConfirmationModal/EmailConfirmationModal.jsx";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [isEmailConfirmationOpen, setIsEmailConfirmationOpen] = useState(false);

    const navigate = useNavigate();

    const openLogin = () => {
        setIsAuthOpen(true);
        setIsRegisterOpen(false);
        setIsForgotPasswordOpen(false);
        setIsEmailConfirmationOpen(false);
    };

    const openRegister = () => {
        setIsAuthOpen(false);
        setIsRegisterOpen(true);
    };

    const openForgotPassword = () => {
        setIsAuthOpen(false);
        setIsForgotPasswordOpen(true);
    };

    const openEmailConfirmation = () => {
        setIsRegisterOpen(false);
        setIsEmailConfirmationOpen(true);
    };

    const closeAllModals = () => {
        setIsAuthOpen(false);
        setIsRegisterOpen(false);
        setIsForgotPasswordOpen(false);
        setIsEmailConfirmationOpen(false);
    };

    const handleAuthSuccess = () => {
        closeAllModals();
        navigate('/profile'); // Перекидаємо в кабінет після успішного входу
    };

    const handleForgotPasswordSuccess = () => {
        closeAllModals();
    };

    return (
        <ModalContext.Provider value={{
            openLogin,
            openRegister,
            openForgotPassword,
            openEmailConfirmation,
            closeAllModals
        }}>
            {children}

            <AuthenticationModal
                isOpen={isAuthOpen}
                onClose={closeAllModals}
                onSuccess={handleAuthSuccess}
                onSwitchToRegister={openRegister}
                onSwitchToForgotPassword={openForgotPassword}
            />

            <RegistrationModal
                isOpen={isRegisterOpen}
                onClose={closeAllModals}
                onSuccess={openEmailConfirmation}
                onSwitchToLogin={openLogin}
            />

            <ForgotPassword
                isOpen={isForgotPasswordOpen}
                onClose={closeAllModals}
                onSuccess={handleForgotPasswordSuccess}
                onSwitchToLogin={openLogin}
            />

            <EmailConfirmationModal
                isOpen={isEmailConfirmationOpen}
                onClose={closeAllModals}
                onSwitchToLogin={openLogin}
            />
        </ModalContext.Provider>
    );
};