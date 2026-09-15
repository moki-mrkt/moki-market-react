import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import {useTranslation} from "react-i18next";

const Footer = () => {
    // Функція для скролу вгору при переході на інші сторінки (опціонально)
    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    const { t } = useTranslation();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__content">

                    <div className="footer__col brand-col">
                        <Link to="/" className="footer-logo" onClick={scrollToTop}>
                            <img src="/img/icon.png" alt="MOKI" />
                        </Link>
                        <div className="footer-socials">
                            <a href="#" aria-label="Facebook">
                                <img src="/img/facebook_logo.svg" alt="facebook" />
                            </a>
                            <a href="https://www.instagram.com/moki_ua_" target="_blank" rel="noreferrer" aria-label="Instagram">
                                <img src="/img/instagram_logo.svg" alt="instagram" />
                            </a>
                            <a href="https://t.me/moki_market" aria-label="Telegram">
                                <img src="/img/telegram_logo.svg" alt="telegram" />
                            </a>
                        </div>
                    </div>

                    <div className="footer__col">
                        <ul className="footer-menu">
                            <li><Link to="/" onClick={scrollToTop}>{t('header.main')}</Link></li>
                            <li><Link to="/catalog" onClick={scrollToTop}>{t('header.catalog')}</Link></li>
                            <li><Link to="/info/about" onClick={scrollToTop}>{t('header.about')}</Link></li>
                            <li><Link to="/info/reviews" onClick={scrollToTop}>{t('header.reviews')}</Link></li>
                            <li><Link to="/promotions" onClick={scrollToTop}>{t('header.promotions')}</Link></li>
                        </ul>
                    </div>

                    <div className="footer__col footer__about_us">
                        <ul className="footer-menu">
                            <li><Link to="/info/payment" onClick={scrollToTop}>{t('mobile-nav.payment')}</Link></li>
                            <li><Link to="/info/return" onClick={scrollToTop}>{t('mobile-nav.return')}</Link></li>
                            <li><Link to="/info/contacts" onClick={scrollToTop}>{t('mobile-nav.info')}</Link></li>
                            <li><Link to="/info/terms" onClick={scrollToTop}>{t('mobile-nav.agreement')}</Link></li>
                        </ul>
                    </div>

                    {/* === Контакти === */}
                    <div className="footer__col contacts-col">
                        <div className="contact-group">
                            <span className="contact-label">{t('footer.contact')}</span>
                            <a href="tel:+380998199796" className="contact-link">+ 380 (99) 819 97 96</a>
                            <a href="tel:+380501689668" className="contact-link">+ 380 (50) 168 96 68</a>
                        </div>

                        <div className="contact-group">
                            <span className="contact-label">{t('footer.email')}</span>
                            <a href="mailto:moki.mrkt@gmail.com" className="contact-link">moki.mrkt@gmail.com</a>
                        </div>

                        <div className="contact-group">
                            <span className="contact-label">{t('footer.workitime')}</span>
                            <span className="contact-text">{t('footer.time')}</span>
                        </div>

                        <div className="contact-group">
                            <span className="contact-label">{t('footer.address')}</span>
                            <span className="contact-text">{t('footer.address-text')}</span>
                        </div>
                    </div>

                </div>

                <div className="footer__bottom">
                    <p>{t('footer.bottom')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;