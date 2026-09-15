import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import {useCart} from "../../contexts/CartContext.jsx";
import { useModal } from '../../contexts/ModalContext.jsx';

import { authService } from '../../services/authService';

import './Header.css';

const Header = () => {

    const { openLogin} = useModal();

    const navigate = useNavigate();
    const location = useLocation();
    const { cartCount, setIsCartOpen } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language.startsWith('uk') ? 'ru' : 'uk';
        i18n.changeLanguage(newLang);
    };

    useEffect(() => {

        const searchParams = new URLSearchParams(location.search);
        let shouldCleanUrl = false;

        const emailStatus = searchParams.get('email-changed');
        if (emailStatus) {
            if (emailStatus === 'success') {
                toast.success(t('toasts.changeEmail'));
                searchParams.set('redirect', 'profile');
            } else if (emailStatus === 'error') {
                toast.error(t('toasts.errorConfirm'));
            }
            searchParams.delete('email-changed');
            shouldCleanUrl = true;
        }


        const activationStatus = searchParams.get('activation');
        if (activationStatus) {
            if (activationStatus === 'success') {
                toast.success(t('toasts.acountActivate'), {
                    duration: 4000,
                    style: { width: '380px' }
                });
                openLogin();
                searchParams.set('redirect', 'profile');
            } else if (activationStatus === 'error') {
                toast.error(t('toasts.errorActivate'), {
                    duration: 4000,
                    style: { width: '300px' }
                });
            }
            searchParams.delete('activation');
            shouldCleanUrl = true;
        }

        if (searchParams.get('login') === 'true') {
            openLogin();
            searchParams.delete('login');
            shouldCleanUrl = true;
        }

        if (shouldCleanUrl) {
            const newSearch = searchParams.toString();
            const newUrl = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;

            navigate(newUrl, { replace: true });
        }
    }, [location.search, navigate, openLogin]);

    const handleCabinetClick = () => {
        if (authService.isAuthenticated()) {
            navigate('/profile/info');
        } else if(location.pathname.startsWith('/products/')) {
            navigate(`${location.pathname}?login=true`);
        } else {
            navigate(`${location.pathname}?login=true&redirect=profile`);
        }
    };

    const handleWishlistClick = () => {
        if (authService.isAuthenticated()) {
            navigate('/profile/wishlist');
        } else {
            navigate(`${location.pathname}?login=true&redirect=wishlist`);
        }
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

            <header className="header">
                <div className="container">
                    <div className="header__content">

                        <Link to="/" className="logo" onClick={closeMenu}>
                            <img src="/img/icon.svg" alt="MOKI" />
                        </Link>

                        <div className="menu-btn">
                            <button
                                className="burger-menu-btn"
                                aria-label="Menu"
                                onClick={toggleMenu}
                            >
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                            <span className="menu-text">{t('menu.menu')}</span>
                        </div>


                        <nav className="main-menu">
                            <ul>
                                <li><Link to="/">{t('header.main')}</Link></li>
                                <li><Link to="/catalog">{t('header.catalog')}</Link></li>
                                <li><Link to="/info/about">{t('header.about')}</Link></li>
                                <li><Link to="/info/reviews">{t('header.reviews')}</Link></li>
                                <li><Link to="/promotions">{t('header.promotions')}</Link></li>
                            </ul>
                        </nav>

                        <div className="search-bar">
                            <button className="search-button" onClick={handleSearch}>
                                <img id="search-button-img" src="/img/search_button.svg" alt="search" />
                            </button>
                            <input className="search-input"
                                   type="text"
                                   placeholder={t('menu.search')}
                                   value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                   onKeyDown={handleKeyDown}
                            />
                            {searchTerm && (
                                <button className="clear-search-btn" onClick={handleClear}>
                                    &times;
                                </button>
                            )}

                        </div>

                        <div >
                            <button
                                onClick={toggleLanguage}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: '#0E2CA4' }}
                            >
                                {i18n.language.startsWith('uk') ? 'RU' : 'UA'}
                            </button>
                        </div>

                        <div className="user-actions">

                            <div className="user-actions-icon">
                                <button onClick={handleCabinetClick} className="icon-cart-btn">
                                    <img src="/img/user.svg" alt="User room" />
                                </button>
                            </div>

                            <div className="user-actions-icon">
                                <button onClick={handleWishlistClick} className="icon-cart-btn">
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
                        <Link to="/" onClick={closeMenu}>{t('mobile-nav.main')}</Link>
                        <Link to="/catalog" onClick={closeMenu}>{t('mobile-nav.catalog')}</Link>

                        <aside className="mobile-sidebar">
                            <ul className="mobile-sidebar-menu">
                                <li><Link to="/catalog" onClick={closeMenu}><img className="sidebar-img" src="/img/all_goods.svg" alt="" /><span>{t('category.all')}</span></Link></li>
                                <li><Link to="/promotions" onClick={closeMenu}><img className="sidebar-img" src="/img/discounts.svg" alt="" /> <span>{t('category.sales')}</span></Link></li>
                                <li><Link to="/catalog/dried-fruits" onClick={closeMenu}><img className="sidebar-img" src="/img/dried_fruits.svg" alt="" /><span>{t('category.dry-fruit')}</span></Link></li>
                                <li><Link to="/catalog/sweets" onClick={closeMenu}><img className="sidebar-img" src="/img/sweets.svg" alt="sweets" /> <span>{t('category.sweets')}</span></Link></li>
                                <li><Link to="/catalog/candies" onClick={closeMenu}><img className="sidebar-img" src="/img/sweets.svg" alt="candies" /> <span>{t('category.candies')}</span></Link></li>
                                <li><Link to="/catalog/nuts" onClick={closeMenu}><img className="sidebar-img" src="/img/nuts.svg" alt="nuts" /> <span>{t('category.nuts')}</span></Link></li>
                                <li><Link to="/catalog/coffee" onClick={closeMenu}><img className="sidebar-img" src="/img/coffee.svg" alt="coffee" /><span>{t('category.coffee')}</span></Link></li>
                                <li><Link to="/catalog/tea" onClick={closeMenu}><img className="sidebar-img" src="/img/coffee.svg" alt="tea" /> <span>{t('category.tea')}</span></Link></li>
                                <li><Link to="/catalog/superfoods" onClick={closeMenu}><img className="sidebar-img" src="/img/all_goods.svg" alt="superfoods" /><span>{t('category.superfood')}</span></Link></li>
                                <li><Link to="/catalog/oils" onClick={closeMenu}><img className="sidebar-img" src="/img/discounts.svg" alt="oils" /><span>{t('category.oils')}</span></Link></li>
                                <li><Link to="/catalog/preserves" onClick={closeMenu}><img className="sidebar-img" src="/img/all_goods.svg" alt="preserves" /><span>{t('category.preserves')}</span></Link></li>
                                <li><Link to="/catalog/snacks" onClick={closeMenu}><img className="sidebar-img" src="/img/nuts.svg" alt="snacks" /><span>{t('category.snecks')}</span></Link></li>
                                <li><Link to="/catalog/spices" onClick={closeMenu}><img className="sidebar-img" src="/img/dried_fruits.svg" alt="spices" /><span>{t('category.spices')}</span></Link></li>
                            </ul>
                        </aside>

                        <Link to="/promotions" onClick={closeMenu}>{t('mobile-nav.sales')}</Link>
                        <Link to="/info/about" onClick={closeMenu}>{t('mobile-nav.about')}</Link>
                        <Link to="/info/reviews" onClick={closeMenu}>{t('mobile-nav.feedback')}</Link>
                        <Link to="/info/payment" onClick={closeMenu}>{t('mobile-nav.payment')}</Link>
                        <Link to="/info/return" onClick={closeMenu}>{t('mobile-nav.return')}</Link>
                        <Link to="/info/contacts" onClick={closeMenu}>{t('mobile-nav.info')}</Link>
                        <Link to="/info/terms" onClick={closeMenu}>{t('mobile-nav.agreement')}</Link>
                    </nav>
                </div>
            </header>
        </>
    );
};

export default Header;