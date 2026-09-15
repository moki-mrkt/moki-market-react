import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import { useTranslation } from 'react-i18next'; // Додано імпорт
import './InfoPage.css';

const InfoPage = () => {
    const { t } = useTranslation(); // Ініціалізація хука

    const breadcrumbs = [
        { path: '/', breadcrumb: t('info.nav.home') },
        { path: null, breadcrumb: t('info.nav.info') }
    ];

    const navItems = [
        { path: 'about', label: t('info.nav.about') },
        { path: 'reviews', label: t('info.nav.reviews') },
        { path: 'payment', label: t('info.nav.payment') },
        { path: 'return', label: t('info.nav.return') },
        { path: 'contacts', label: t('info.nav.contacts') },
        { path: 'terms', label: t('info.nav.terms') }
    ];

    return (
        <section className="hero-section">
            <div className="container hero__grid">
                <Breadcrumbs customCrumbs={breadcrumbs} />
                <div className="info-grid">
                    <aside className="info-sidebar">
                        <ul className="info-nav">
                            {navItems.map(item => (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) => isActive ? "js-tab-link active" : "js-tab-link"}
                                    >
                                        {item.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </aside>
                    <div className="info-content">
                        <Outlet />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InfoPage;