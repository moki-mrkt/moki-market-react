import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import './InfoPage.css';

const InfoPage = () => {
    const breadcrumbs = [
        { path: '/', breadcrumb: 'Головна' },
        { path: null, breadcrumb: 'Інформація' }
    ];

    const navItems = [
        { path: 'about', label: 'Про нас' },
        { path: 'reviews', label: 'Відгуки' },
        { path: 'payment', label: 'Оплата та доставка' },
        { path: 'return', label: 'Обмін та повернення' },
        { path: 'contacts', label: 'Контактна інформація' },
        { path: 'terms', label: 'Користувацька угода' }
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