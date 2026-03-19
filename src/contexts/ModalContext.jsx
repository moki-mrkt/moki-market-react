import React, { createContext, useContext, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

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

    const location = useLocation();
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

        const searchParams = new URLSearchParams(location.search);

        if (searchParams.has('login') || searchParams.has('redirect') || searchParams.has('tab')) {
            searchParams.delete('login');
            searchParams.delete('redirect')
            searchParams.delete('tab')

            const newSearch = searchParams.toString();
            const newUrl = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;

            navigate(newUrl, { replace: true });
        }
    };

    const handleLoginSuccess = () => {
        closeAllModals();

        const searchParams = new URLSearchParams(location.search);
        const redirectParam = searchParams.get('redirect');

        if (redirectParam === 'profile') {
            navigate('/profile/info');
        } else if(redirectParam === 'wishlist') {
            navigate('/profile/wishlist');
        }
        else if(redirectParam === 'reviews') {
            navigate('/profile/reviews');
        }
        else {
            searchParams.delete('login');
            const newUrl = searchParams.toString() ? `${location.pathname}?${searchParams.toString()}` : location.pathname;
            navigate(newUrl, { replace: true });
        }
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
                onSuccess={handleLoginSuccess}
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
                onSuccess={closeAllModals}
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