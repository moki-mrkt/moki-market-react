import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {useCart} from "../CartContext/CartContext.jsx";

import { authService } from '../../services/authService';

import './Header.css';

import AuthenticationModal from "../Modals/AuthenticationModal/AuthenticationModal";
import RegistrationModal from "../Modals/RegistrationModal/RegistrationModal";
import ForgotPassword from "../Modals/ForgotPassword/ForgotPasswordModal.jsx";
import EmailConfirmationModal from "../Modals/EmailConfirmationModal/EmailConfirmationModal.jsx";

const Header = () => {

    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [isEmailConfirmationOpen, setIsEmailConfirmationOpen] = useState(false);

    const navigate = useNavigate();

    const { cartCount, setIsCartOpen } = useCart();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

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
      setIsEmailConfirmationOpen(true)
    };

    const closeAllModals = () => {
        setIsAuthOpen(false);
        setIsRegisterOpen(false);
        setIsForgotPasswordOpen(false);
        setIsEmailConfirmationOpen(false);
    };

    const handleCabinetClick = () => {
        if (authService.isAuthenticated()) {
            navigate('/profile');
        } else {
            openLogin();
        }
    };

    const handleAuthSuccess = () => {
        closeAllModals();
        navigate('/profile');
    };

    const handleForgotPasswordSuccess = () => {
        closeAllModals();
    };

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
    };

    const handleClear = () => {
        setSearchTerm('');
        document.querySelector('.search-input').focus();
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <div className="top-bar">
                <div className="container">
                    <div className="top-bar__content">
                        <div className="socials">
                            <a href="#" aria-label="Facebook">
                                <img className="icon" src="/img/facebook_logo.svg" alt="facebook" />
                            </a>
                            <a href="https://www.instagram.com/moki_ua_" target="_blank" rel="noreferrer" aria-label="Instagram">
                                <img className="icon" src="/img/instagram_logo.svg" alt="instagram" />
                            </a>
                            <a href="https://t.me/moki_market" aria-label="Telegram">
                                <img className="icon" src="/img/telegram_logo.svg" alt="telegram" />
                            </a>
                        </div>
                        <div className="phones">
                            <a href="tel:+380998199796">+ 380 (99) 819 97 96</a>
                            <a href="tel:+380501689668">+ 380 (50) 168 96 68</a>
                        </div>
                    </div>
                </div>
            </div>

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

            <header className="header">
                <div className="container">
                    <div className="header__content">

                        <Link to="/" className="logo" onClick={closeMenu}>
                            <img src="/img/icon.svg" alt="MOKI" />
                        </Link>

                        <button
                            className="burger-menu-btn"
                            aria-label="Menu"
                            onClick={toggleMenu}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>

                        <nav className="main-menu">
                            <ul>
                                <li><Link to="/">Головна</Link></li>
                                <li><Link to="/catalog">Каталог</Link></li>
                                <li><Link to="/info/about">Про нас</Link></li>
                                <li><Link to="/info/reviews">Відгуки</Link></li>
                                <li><Link to="/promotions">Акції</Link></li>
                            </ul>
                        </nav>

                        <div className="search-bar">
                            <button className="search-button" onClick={handleSearch}>
                                <img id="search-button-img" src="/img/search_button.svg" alt="search" />
                            </button>
                            <input className="search-input"
                                   type="text"
                                   placeholder="Пошук"
                                   value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                   onKeyDown={handleKeyDown}
                            />
                            {searchTerm && (
                                <button className="clear-search-btn" onClick={handleClear}>
                                    &times;
                                </button>
                            )}
                        </div>

                        <div className="user-actions">
                            <div className="user-actions-icon">
                                <button onClick={handleCabinetClick} className="icon-cart-btn">
                                    <img src="/img/user.svg" alt="User room" />
                                </button>
                            </div>

                            <div className="user-actions-icon">
                                <button onClick={handleCabinetClick} className="icon-cart-btn">
                                    <img src="/img/fav.svg" alt="fav" />
                                </button>
                            </div>


                            <div className="user-actions-icon">
                                <button
                                    className="icon-cart-btn"
                                    onClick={() => setIsCartOpen(true)}
                                >
                                    <img src="/img/cart.svg" alt="Cart" />
                                    {cartCount > 0 && (
                                        <span className="cart-badge">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`}
                    onClick={closeMenu}
                ></div>

                <div className={`mobile-menu-drawer ${isMenuOpen ? 'active' : ''}`}>
                    <div className="mobile-menu-header">
                        <Link to="/" className="mobile-logo" onClick={closeMenu}>
                            <img src="/img/icon.svg" alt="MOKI" />
                        </Link>
                        <button className="close-menu-btn" aria-label="Close menu" onClick={closeMenu}>&times;</button>
                    </div>

                    <nav className="mobile-nav-list">
                        <Link to="/" onClick={closeMenu}>Головна</Link>
                        <Link to="/catalog" onClick={closeMenu}>Каталог</Link>

                        <aside className="mobile-sidebar">
                            <ul className="mobile-sidebar-menu">
                                <li><Link to="/catalog" onClick={closeMenu}><img className="sidebar-img" src="/img/all_goods.svg" alt="" /> <span>Всі товари</span></Link></li>
                                <li><Link to="/promotions" onClick={closeMenu}><img className="sidebar-img" src="/img/discounts.svg" alt="" /> <span>Акційні товари</span></Link></li>
                                <li><Link to="/catalog/dried_fruits" onClick={closeMenu}><img className="sidebar-img" src="/img/dried_fruits.svg" alt="" /> <span>Сухофрукти</span></Link></li>
                                <li><Link to="/catalog/candies" onClick={closeMenu}><img className="sidebar-img" src="/img/sweets.svg" alt="candies" /> <span>Солодощі</span></Link></li>
                                <li><Link to="/catalog/nuts" onClick={closeMenu}><img className="sidebar-img" src="/img/nuts.svg" alt="nuts" /> <span>Горіхи</span></Link></li>
                                <li><Link to="/catalog/coffee" onClick={closeMenu}><img className="sidebar-img" src="/img/coffee.svg" alt="coffee" /> <span>Кава</span></Link></li>
                                <li><Link to="/catalog/tea" onClick={closeMenu}><img className="sidebar-img" src="/img/coffee.svg" alt="tea" /> <span>Чай</span></Link></li>
                                <li><Link to="/catalog/super_food" onClick={closeMenu}><img className="sidebar-img" src="/img/all_goods.svg" alt="superfood" /><span>Суперфуд</span></Link></li>
                                <li><Link to="/catalog/oils" onClick={closeMenu}><img className="sidebar-img" src="/img/discounts.svg" alt="oils" /><span>Олія та масла</span></Link></li>
                                <li><Link to="/catalog/conservation" onClick={closeMenu}><img className="sidebar-img" src="/img/all_goods.svg" alt="conservation" /><span>Консервація</span></Link></li>
                                <li><Link to="/catalog/snacks" onClick={closeMenu}><img className="sidebar-img" src="/img//nuts.svg" alt="snacks" /><span>Снеки та чіпси</span></Link></li>
                                <li><Link to="/catalog/spices" onClick={closeMenu}><img className="sidebar-img" src="/img/dried_fruits.svg" alt="spices" /><span>Спеції</span></Link></li>
                            </ul>
                        </aside>

                        <Link to="/promotions" onClick={closeMenu}>Акції</Link>
                        <Link to="/info/about" onClick={closeMenu}>Про нас</Link>
                        <Link to="/info/reviews" onClick={closeMenu}>Відгуки</Link>
                        <Link to="/info/payment" onClick={closeMenu}>Оплата та доставка</Link>
                        <Link to="/info/return" onClick={closeMenu}>Обмін та повернення</Link>
                        <Link to="/info/contacts" onClick={closeMenu}>Контактна інформація</Link>
                        <Link to="/info/terms" onClick={closeMenu}>Користувацька угода</Link>
                    </nav>
                </div>
            </header>
        </>
    );
};

export default Header;