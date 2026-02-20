import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Не забудьте перенести сюди ваш CSS файл

const Footer = () => {
    // Функція для скролу вгору при переході на інші сторінки (опціонально)
    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__content">

                    <div className="footer__col brand-col">
                        <Link to="/" className="footer-logo" onClick={scrollToTop}>
                            <img src="/icon.svg" alt="MOKI" />
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
                            <li><Link to="/" onClick={scrollToTop}>Головна</Link></li>
                            <li><Link to="/catalog" onClick={scrollToTop}>Каталог</Link></li>
                            <li><Link to="/info/about" onClick={scrollToTop}>Про нас</Link></li>
                            <li><Link to="/info/reviews" onClick={scrollToTop}>Відгуки</Link></li>
                            <li><Link to="/promotions" onClick={scrollToTop}>Акції</Link></li>
                        </ul>
                    </div>

                    <div className="footer__col footer__about_us">
                        <ul className="footer-menu">
                            <li><Link to="/info/payment" onClick={scrollToTop}>Оплата та доставка</Link></li>
                            <li><Link to="/info/return" onClick={scrollToTop}>Обмін та повернення</Link></li>
                            <li><Link to="/info/contacts" onClick={scrollToTop}>Контактна інформація</Link></li>
                            <li><Link to="/info/terms" onClick={scrollToTop}>Користувацька угода</Link></li>
                        </ul>
                    </div>

                    {/* === Контакти === */}
                    <div className="footer__col contacts-col">
                        <div className="contact-group">
                            <span className="contact-label">Контакти</span>
                            <a href="tel:+380998199796" className="contact-link">+ 380 (99) 819 97 96</a>
                            <a href="tel:+380501689668" className="contact-link">+ 380 (50) 168 96 68</a>
                        </div>

                        <div className="contact-group">
                            <span className="contact-label">Електронна пошта</span>
                            <a href="mailto:moki.mrkt@gmail.com" className="contact-link">moki.mrkt@gmail.com</a>
                        </div>

                        <div className="contact-group">
                            <span className="contact-label">Графік роботи</span>
                            <span className="contact-text">Пн - Нд: 7:00 - 21:00</span>
                        </div>

                        <div className="contact-group">
                            <span className="contact-label">Адреса</span>
                            <span className="contact-text">вул. Чугуївська, 78</span>
                        </div>
                    </div>

                </div>

                <div className="footer__bottom">
                    <p>Moki. Усі права захищено.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;