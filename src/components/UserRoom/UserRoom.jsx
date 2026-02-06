// src/components/UserRoom/UserRoom.jsx
import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import './UserRoom.css';

const UserRoom = () => {
    // Стан для мобільного меню сайдбару
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <section className="account-section container">
            <h2 className="user-room-title">Особистий кабінет</h2>

            {/* Картка користувача */}
            <div className="user-summary-card">
                <div className="user-summary-info">
                    <div className="user-avatar-circle">
                        <img src="/img/white_user.png" alt="User" />
                    </div>
                    <div className="user-text">
                        <div className="user-name">
                            <span id="first-name">Тетяна</span> <span id="second-name">Павлова</span>
                        </div>
                        <div className="user-phone">380674445231</div>
                    </div>
                </div>
                <button className="edit-profile-btn">
                    <img src="/img/edit-icon.svg" alt="Edit" />
                </button>
            </div>

            <hr className="line-desktop" />

            <div className="account-grid">
                {/* Сайдбар */}
                <aside className={`account-sidebar ${isSidebarOpen ? 'active' : ''}`} id="accountSidebar">

                    <div className="sidebar-header" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <span className="sidebar-title">Меню</span>
                        <img src="/img/arrow_sort.svg" alt="toggle" className="sidebar-toggle-icon" />
                    </div>

                    <nav className="account-nav">
                        <ul>
                            <li>
                                <NavLink to="info" className={({ isActive }) => isActive ? "tab-link active" : "tab-link"}>
                                    <img src="/img/user_blue.svg" alt="Info" />
                                    <span>Особиста інформація</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="orders" className={({ isActive }) => isActive ? "tab-link active" : "tab-link"}>
                                    <img src="/img/blue_cart.svg" alt="Orders" />
                                    <span>Мої замовлення</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="wishlist" className={({ isActive }) => isActive ? "tab-link active" : "tab-link"}>
                                    <img src="/img/heart-outline.svg" alt="Wishlist" />
                                    <span>Улюблені товари</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="reviews" className={({ isActive }) => isActive ? "tab-link active" : "tab-link"}>
                                    <img src="/img/like.svg" alt="Reviews" />
                                    <span>Відгук</span>
                                </NavLink>
                            </li>
                            <li>
                                {/* Тут логіка виходу */}
                                <Link to="/" className="logout-link">
                                    <img src="/img/logout.svg" alt="Exit" />
                                    <span>Вихід</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Тут буде відображатися контент вибраної вкладки */}
                <div className="account-content">
                    <Outlet />
                </div>
            </div>
        </section>
    );
};

export default UserRoom;