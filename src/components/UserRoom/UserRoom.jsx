import React, {useState, useEffect, useRef} from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import AvatarCropperModal from './AvatarCropperModal';

import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import { imageService } from '../../services/imageService';

import './UserRoom.css';
import {useCart} from "../../contexts/CartContext.jsx";

const UserRoom = () => {

    const { clearCart } = useCart();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedImageSrc, setSelectedImageSrc] = useState(null); // URL для кропера
    const [isCropperOpen, setIsCropperOpen] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userData = await userService.getProfile();
                setUser(userData);
            } catch (error) {
                console.error("Помилка завантаження профілю:", error);
                toast.error("Не вдалося завантажити дані профілю");
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Зчитуємо файл, щоб показати його в кропері (як ви робили в ImageUploader.jsx)
        const reader = new FileReader();
        reader.onload = () => {
            setSelectedImageSrc(reader.result);
            setIsCropperOpen(true);
        };
        reader.readAsDataURL(file);

        event.target.value = ''; // Очищаємо інпут
    };

    const handleCropSave = async (croppedBlob) => {
        setIsCropperOpen(false);
        setIsUploading(true);

        // Конвертуємо Blob назад у File
        const croppedFile = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });

        try {
            const uploadRes = await imageService.uploadImage('users', croppedFile);
            const newImageKey = uploadRes.key;
            const updatedUser = await userService.updateAvatar(newImageKey);

            setUser(updatedUser.data ? updatedUser.data : updatedUser);
            toast.success('Фото профілю оновлено');
        } catch (error) {
            console.error('Помилка завантаження фото:', error);
            toast.error('Не вдалося завантажити фото');
        } finally {
            setIsUploading(false);
            setSelectedImageSrc(null);
        }
    };


    const handleDeleteAvatar = async (e) => {
        e.stopPropagation();

        setIsUploading(true);
        try {
            const updatedUser = await userService.deleteAvatar();
            setUser(updatedUser);
            toast.success('Фото видалено');
        } catch (error) {
            toast.error('Помилка видалення фото');
        } finally {
            setIsUploading(false);
        }
    };

    const handleLogout = () => {
        authService.logoutUser();
        clearCart();
        localStorage.removeItem('guest_cart');
    };

    if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Завантаження...</div>;
     if (!user) return <div style={{textAlign: 'center', marginTop: '50px'}}>Користувача не знайдено</div>;

    return (
        <section className="account-section container">
            <h2 className="user-room-title">Особистий кабінет</h2>

            <div className="user-summary-card">
                <div className="user-summary-info">

                    <div
                        className={`user-avatar-circle interactive ${isUploading ? 'uploading' : ''}`}
                        onClick={() => !user.imageUrl && !isUploading && fileInputRef.current.click()}
                    >
                        {user.imageUrl ? (
                            <>
                                <img src={user.imageUrl} alt="User Avatar" className="avatar-image" />
                                <div className="avatar-overlay delete-overlay" onClick={handleDeleteAvatar}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" ><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </div>
                            </>
                        ) : (
                            <>
                                <img src="/img/white_user.svg" alt="User"/>
                                <div className="avatar-overlay add-overlay">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                </div>
                            </>
                        )}

                        {isUploading && (
                            <div className="avatar-uploading-spinner">...</div>
                        )}

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                    </div>

                    <div className="user-text">
                        <div className="user-name">
                            <span id="first-name">{user.firstName}</span> <span id="second-name">{user.secondName}</span>
                        </div>
                        <div className="user-phone">{user.phoneNumber || 'Телефон не вказано'}</div>
                    </div>
                </div>
            </div>

            <hr className="line-desktop" />

            <div className="account-grid">
                {/* Сайдбар */}
                <aside className={`account-sidebar ${isSidebarOpen ? 'open' : ''}`} id="accountSidebar">

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
                                <NavLink to="security" className={({ isActive }) => isActive ? "tab-link active" : "tab-link"}>
                                    <img src="/img/security.svg" alt="Security" />
                                    <span>Безпека</span>
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
                                <button className="logout-link" onClick={handleLogout}>
                                    <img className="logout-img" src="/img/logout.svg" alt="Exit" />
                                    <span>Вихід</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Тут буде відображатися контент вибраної вкладки */}
                <div className="account-content">
                    <Outlet context={{ user, setUser }} />
                </div>
            </div>

            {isCropperOpen && (
                <AvatarCropperModal
                    imageSrc={selectedImageSrc}
                    onClose={() => {
                        setIsCropperOpen(false);
                        setSelectedImageSrc(null);
                    }}
                    onSave={handleCropSave}
                />
            )}
        </section>
    );
};

export default UserRoom;