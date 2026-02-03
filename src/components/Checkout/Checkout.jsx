import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

// Якщо ви переносите стилі в папку компонента:
import './Checkout.css';
// Або використовуйте глобальний файл, якщо він підключений в index.js/App.jsx

const Checkout = () => {
    // --- СТАН ДАНИХ ФОРМИ ---
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        deliveryMethod: 'nova_poshta', // 'nova_poshta' | 'ukr_poshta'
        city: '',
        department: '',
        paymentMethod: 'card' // 'card' | 'cod' (cash on delivery)
    });

    // --- СТАН КОШИКА (Заглушка, тут має бути запит до cartService) ---
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'Дубайський шоколад Coral 100г',
            price: 120,
            quantity: 1,
            image: '/img/categories/coffee.png'
        },
        {
            id: 2,
            name: 'Фісташкова паста 200г',
            price: 120,
            quantity: 1,
            image: '/icon.png'
        }
    ]);

    // --- ОБЧИСЛЕННЯ СУМ ---
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = 10; // Статична знижка або логіка розрахунку
    const totalPay = totalAmount - discount;

    // --- ОБРОБНИКИ ПОДІЙ ---
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleRadioChange = (e) => {
        const { name, value } = e.target;
        // name = 'delivery' або 'payment'
        // value ми задаємо вручну в інпутах нижче (наприклад, value="nova_poshta")
        const fieldName = name === 'delivery' ? 'deliveryMethod' : 'paymentMethod';
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleQuantityChange = (id, delta) => {
        setCartItems(prevItems => prevItems.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                return { ...item, quantity: newQty > 0 ? newQty : 1 };
            }
            return item;
        }));
    };

    const handleRemoveItem = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Відправка замовлення:", { ...formData, items: cartItems, totalPay });
        alert("Замовлення оформлено! (див. консоль)");
        // Тут виклик orderService.createOrder(...)
    };

    // Хлібні крихти
    const breadcrumbs = [
        { path: '/', breadcrumb: 'Головна' },
        { path: '/cart', breadcrumb: 'Кошик' }, // Опціонально
        { path: null, breadcrumb: 'Оформлення замовлення' }
    ];

    return (

            <section className="hero-section">
                <div className="container hero__grid">

                    <Breadcrumbs customCrumbs={breadcrumbs} />

                    <div className="checkout-grid">

                        {/* ЛІВА ЧАСТИНА - ФОРМА */}
                        <div className="checkout-form">
                            <form onSubmit={handleSubmit}>

                                {/* ДАНІ КЛІЄНТА */}
                                <section className="form-section">
                                    <h2 className="section-title">Дані клієнта</h2>

                                    <div className="input-group user-info-input">
                                        <input
                                            type="email"
                                            id="email"
                                            className="checkout-input"
                                            placeholder=" "
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <label htmlFor="email" className="floating-label">E-mail</label>
                                        <span className="helper-text">Це поле обов'язкове</span>
                                    </div>

                                    <div className="input-group user-info-input">
                                        <input
                                            type="tel"
                                            id="phone"
                                            className="checkout-input"
                                            placeholder=" "
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <label htmlFor="phone" className="floating-label">Телефон</label>
                                        <span className="helper-text">Це поле обов'язкове</span>
                                    </div>

                                    <div className="row-inputs user-info-input">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                id="firstName"
                                                className="checkout-input"
                                                placeholder=" "
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <label htmlFor="firstName" className="floating-label">Ім'я</label>
                                            <span className="helper-text">Це поле обов'язкове</span>
                                        </div>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                id="lastName"
                                                className="checkout-input"
                                                placeholder=" "
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <label htmlFor="lastName" className="floating-label">Прізвище</label>
                                            <span className="helper-text">Це поле обов'язкове</span>
                                        </div>
                                    </div>

                                    <div className="info-message">
                                        <img src="/img/info-icon.svg" alt="info" className="info-icon" />
                                        <p>Вкажи своє справжнє прізвище та ім'я, інакше ми не зможемо доставити Твою посилку.</p>
                                    </div>
                                </section>

                                {/* СПОСІБ ДОСТАВКИ */}
                                <section className="form-section">
                                    <h2 className="section-title">Спосіб доставки</h2>

                                    <div className="radio-group user-info-input">
                                        <label className="radio-card">
                                            <input
                                                type="radio"
                                                name="delivery"
                                                value="nova_poshta"
                                                checked={formData.deliveryMethod === 'nova_poshta'}
                                                onChange={handleRadioChange}
                                            />
                                            <span className="radio-custom"></span>
                                            <span className="radio-label">Нова Пошта - Відділення</span>
                                        </label>
                                        <hr />
                                        <label className="radio-card">
                                            <input
                                                type="radio"
                                                name="delivery"
                                                value="ukr_poshta"
                                                checked={formData.deliveryMethod === 'ukr_poshta'}
                                                onChange={handleRadioChange}
                                            />
                                            <span className="radio-custom"></span>
                                            <span className="radio-label">Укр Пошта - Відділення</span>
                                        </label>
                                    </div>

                                    <div className="row-inputs delivery-selects">
                                        <div className="select-wrapper">
                                            <label>
                                                <select className="checkout-select" defaultValue="">
                                                    <option disabled value="">Вибрати місто</option>
                                                    <option>Київ</option>
                                                    <option>Харків</option>
                                                </select>
                                            </label>
                                        </div>
                                        <div className="select-wrapper">
                                            <label>
                                                <select className="checkout-select" defaultValue="">
                                                    <option disabled value="">Вибрати відділення</option>
                                                    <option>Відділення №1</option>
                                                    <option>Відділення №2</option>
                                                </select>
                                            </label>
                                        </div>
                                    </div>
                                </section>

                                {/* СПОСІБ ОПЛАТИ */}
                                <section className="form-section">
                                    <h2 className="section-title">Спосіб оплати</h2>

                                    <div className="radio-group user-info-input">
                                        <label className="radio-card payment-card">
                                            <div className="radio-left">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="card"
                                                    checked={formData.paymentMethod === 'card'}
                                                    onChange={handleRadioChange}
                                                />
                                                <span className="radio-custom"></span>
                                                <div className="payment-icons-group">
                                                    <img src="/img/visa.png" alt="Visa" />
                                                </div>
                                                <span className="radio-label">Оплата картою</span>
                                            </div>
                                        </label>
                                        <hr />
                                        <label className="radio-card payment-card">
                                            <div className="radio-left">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="cod"
                                                    checked={formData.paymentMethod === 'cod'}
                                                    onChange={handleRadioChange}
                                                />
                                                <span className="radio-custom"></span>
                                                <div className="payment-icons-group">
                                                    <img src="/img/wallet.svg" alt="Wallet" />
                                                </div>
                                                <span className="radio-label">Оплата при отриманні</span>
                                            </div>
                                        </label>
                                    </div>
                                </section>

                                <div className="checkout-button-wrapper">
                                    <button type="submit" className="checkout-button">
                                        Оформити замовлення
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* ПРАВА ЧАСТИНА - САЙДБАР КОШИКА */}
                        <aside className="order-summary">
                            <h2 className="summary-title">Ваше замовлення</h2>

                            <div className="cart-items">
                                {cartItems.map(item => (
                                    <div className="cart-item" key={item.id}>
                                        <div className="cart-img">
                                            <img src={item.image} alt={item.name} />
                                        </div>

                                        <div className="cart-info">
                                            <div>
                                                <h4 className="cart-name">{item.name}</h4>
                                            </div>

                                            <div className="cart-controls">
                                                <div className="qty-and-trash">
                                                    <div className="qty-counter">
                                                        <button
                                                            className="btn-minus"
                                                            onClick={() => handleQuantityChange(item.id, -1)}
                                                        >-</button>
                                                        <input type="text" value={item.quantity} readOnly />
                                                        <button
                                                            className="btn-plus"
                                                            onClick={() => handleQuantityChange(item.id, 1)}
                                                        >+</button>
                                                    </div>
                                                    <button
                                                        className="remove-btn action-mobile"
                                                        onClick={() => handleRemoveItem(item.id)}
                                                    >
                                                        <img src="/img/trash.svg" alt="delete" />
                                                    </button>
                                                </div>
                                                <div className="item-price action-mobile">{item.price} грн</div>
                                            </div>
                                        </div>

                                        <div className="cart-price-action-desktop">
                                            <span className="item-price">{item.price * item.quantity} грн</span>
                                            <button
                                                className="remove-btn"
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                <img src="/img/trash.svg" alt="delete" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="order-totals">
                                <div className="total-row final-total together">
                                    <span>Разом</span>
                                </div>
                                <div className="total-row small-row">
                                    <span>{cartItems.length} товари на суму:</span>
                                    <span className="total-amount">{totalAmount} грн</span>
                                </div>
                                <div className="total-row discount small-row">
                                    <span>У тому числі знижка:</span>
                                    <span className="total-discount">-{discount} грн</span>
                                </div>
                                <div className="total-row final-total">
                                    <span>До сплати:</span>
                                    <span className="total-pay">{totalPay} грн</span>
                                </div>
                            </div>
                        </aside>

                    </div>
                </div>
            </section>
    );
};

export default Checkout;