import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import { useCart } from '../../contexts/CartContext.jsx';

import { orderService } from '../../services/orderService';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';

import './Checkout.css';
import SuccessOrderModal from "../Modals/SuccessOrderModal/SuccessOrderModal.jsx";
import toast from "react-hot-toast";

const Checkout = () => {
    const navigate = useNavigate();

    const {
        cartItems,
        updateQuantity,
        removeFromCart,
        clearCart
    } = useCart();

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [orderNumber, setOrderNumber] = useState(null);

    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        email: '',
        phoneNumber: '+380',
        firstName: '',
        lastName: '',
        deliveryType: 'nova_poshta',
        paymentType: 'card',
        city: '',
        region: '',
        postOffice: '',
        street: '',
        houseNumber: '',
        apartment: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (authService.isAuthenticated()) {
                try {
                    const userData = await userService.getProfile();

                    const reverseDeliveryMap = {
                        'NOVA_POSHTA': 'nova_poshta',
                        'UKR_POSHTA': 'ukr_poshta'
                    };

                    setFormData(prev => ({
                        ...prev,
                        email: userData.email || prev.email,
                        firstName: userData.firstName || prev.firstName,
                        lastName: userData.lastName || userData.secondName || prev.lastName,
                        phoneNumber: userData.phoneNumber ? userData.phoneNumber : prev.phoneNumber,

                        deliveryType: userData.deliveryInfo?.deliveryType
                            ? reverseDeliveryMap[userData.deliveryInfo.deliveryType] || prev.deliveryType
                            : prev.deliveryType,

                        city: userData.deliveryInfo?.city || prev.city,
                        region: userData.deliveryInfo?.region || prev.region,

                        postOffice: userData.deliveryInfo?.postOffice || prev.postOffice,

                        street: userData.deliveryInfo?.street || prev.street,
                        houseNumber: userData.deliveryInfo?.house || prev.houseNumber,
                        apartment: userData.deliveryInfo?.apartment || prev.apartment
                    }));
                } catch (error) {
                    console.error("Помилка завантаження даних користувача:", error);
                }
            }
        };

        fetchUserData();
    }, []);

    const { originalTotal, discountAmount, finalTotal } = useMemo(() => {
        let original = 0;
        let final = 0;

        cartItems.forEach(item => {
            const price = Number(item.priceWithoutDiscount) || 0;
            const qty = item.quantity || 1;

            original += price * qty;

            final += item.itemTotal;
        });

        return {
            originalTotal: original,
            discountAmount: original - final,
            finalTotal: final
        };
    }, [cartItems]);

    useEffect(() => {
        if (cartItems.length === 0) {
        }
    }, [cartItems, navigate]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));

        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleFocus = (e) => {
        const { id } = e.target;
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: false }));
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;

        if (!value.startsWith('+380')) {
            setFormData(prev => ({ ...prev, phoneNumber: '+380' }));
            return;
        }

        if (!/^\d*$/.test(value.slice(1))) return;

        if (value.length > 13) return;

        setFormData(prev => ({ ...prev, phoneNumber: value }));
    };

    const handleRadioChange = (e) => {
        const { name, value } = e.target;
        const fieldName = name === 'delivery' ? 'deliveryType' : 'paymentType';
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleQuantityChange = (id, currentQty, delta) => {
        const newQty = currentQty + delta;
        updateQuantity(id, newQty);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.region.trim()) newErrors.region = true;
        if (!formData.city.trim()) newErrors.city = true;
        if (!formData.postOffice.trim()) newErrors.postOffice = true;
        if (!formData.firstName.trim()) newErrors.firstName = true;
        if (!formData.lastName.trim()) newErrors.lastName = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Будь ласка, заповніть обов\'язкові поля');
            return;
        }


        if (formData.phoneNumber.length !== 13) {
            newErrors.phoneNumber = true;
            setErrors(newErrors);
            toast.error('Будь ласка, введіть повний номер телефону (+380...)');
            return;
        }

        const deliveryTypeMap = {
            'nova_poshta': 'NOVA_POSHTA',
            'ukr_poshta': 'UKR_POSHTA'
        };

        const paymentTypeMap = {
            'cod': 'CASH',
            'card': 'CARD'
        };

        const orderPayload = {
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            firstName: formData.firstName,
            secondName: formData.lastName,

            deliveryType: deliveryTypeMap[formData.deliveryType] || 'NOVA_POSHTA',
            paymentType: paymentTypeMap[formData.paymentType] || 'CASH',

            cartItems: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity
            })),

            addressDTO: {
                city: formData.city || "",
                region: formData.region || "",
                department: formData.postOffice || "",
                street: formData.street || "",
                houseNumber: formData.houseNumber || "",
                apartment: formData.apartment ||  ""
            }
        };

        try {
            const response = await orderService.createOrder(orderPayload);
            setOrderNumber(response.orderNumber)

            setIsSuccessModalOpen(true);
            clearCart();

        } catch (error) {
            toast.error('Сталася помилка при оформленні. Перевірте дані.');
        }
    };

    const handleCloseModal = () => {
        setIsSuccessModalOpen(false);
        navigate('/');
    };

    const getImageUrl = (item) => {
        if (item.image) return item.image;
        if (item.images && item.images.length > 0) return item.images[0].imageUrl;
        return '/icon.png';
    };

    const breadcrumbs = [
        { path: '/', breadcrumb: 'Головна' },
        { path: null, breadcrumb: 'Оформлення замовлення' }
    ];

    if (cartItems.length === 0 && !isSuccessModalOpen) {
        return (
            <section className="hero-section">
                <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <h2>Ваш кошик порожній</h2>
                    <p style={{ margin: '20px 0', color: '#6B7280' }}>Додайте товари, щоб оформити замовлення.</p>
                    <Link to="/" className="checkout-button" style={{ display: 'inline-block', maxWidth: '350px', textDecoration: 'none', color: "white", paddingTop: "10px" }}>
                        Перейти до покупок
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="hero-section">
            <div className="container hero__grid">

                <SuccessOrderModal
                    isOpen={isSuccessModalOpen}
                    onClose={handleCloseModal}
                    orderNumber={orderNumber}
                />

                <Breadcrumbs customCrumbs={breadcrumbs} />

                <div className="checkout-grid">

                    <div className="checkout-form">
                        <form onSubmit={handleSubmit}>

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
                                    />
                                    <label htmlFor="email" className="floating-label">E-mail</label>
                                </div>

                                <div className="input-group user-info-input">
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        className={`checkout-input ${errors.phoneNumber ? 'invalid-input' : ''}`}
                                        placeholder=" "
                                        value={formData.phoneNumber}
                                        onChange={handlePhoneChange}
                                        onFocus={handleFocus}
                                        maxLength={13}
                                    />
                                    <label htmlFor="phoneNumber" className="floating-label">Телефон*</label>
                                </div>

                                <div className="row-inputs user-info-input">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            id="firstName"
                                            className={`checkout-input ${errors.firstName ? 'invalid-input' : ''}`}
                                            placeholder=" "
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            onFocus={handleFocus}
                                        />
                                        <label htmlFor="firstName" className="floating-label">Ім'я*</label>
                                    </div>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            id="lastName"
                                            className={`checkout-input ${errors.lastName ? 'invalid-input' : ''}`}
                                            placeholder=" "
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            onFocus={handleFocus}
                                        />
                                        <label htmlFor="lastName" className="floating-label">Прізвище*</label>
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
                                            checked={formData.deliveryType === 'nova_poshta'}
                                            onChange={handleRadioChange}
                                        />
                                        <span className="radio-custom"></span>
                                        <span className="radio-label">Нова Пошта - відділення</span>
                                    </label>
                                    <hr />

                                    {/*<label className="radio-card">*/}
                                    {/*    <input*/}
                                    {/*        type="radio"*/}
                                    {/*        name="delivery"*/}
                                    {/*        value="nova_poshta"*/}
                                    {/*        checked={formData.deliveryType === 'nova_poshta'}*/}
                                    {/*        onChange={handleRadioChange}*/}
                                    {/*    />*/}
                                    {/*    <span className="radio-custom"></span>*/}
                                    {/*    <span className="radio-label">Нова Пошта - поштомат</span>*/}
                                    {/*</label>*/}
                                    {/*<hr />*/}
                                    <label className="radio-card">
                                        <input
                                            type="radio"
                                            name="delivery"
                                            value="ukr_poshta"
                                            checked={formData.deliveryType === 'ukr_poshta'}
                                            onChange={handleRadioChange}
                                        />
                                        <span className="radio-custom"></span>
                                        <span className="radio-label">Укр Пошта - відділення</span>
                                    </label>
                                </div>

                                <div className="row-inputs">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                id="region"
                                                className={`checkout-select ${errors.region ? 'invalid-input' : ''}`}
                                                placeholder="Область"
                                                value={formData.region}
                                                onChange={handleInputChange}
                                                onFocus={handleFocus}
                                            />
                                            <label htmlFor="postOffice" className="floating-label"></label>
                                        </div>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                id="city"
                                                className={`checkout-select ${errors.city ? 'invalid-input' : ''}`}
                                                placeholder="Населений пункт"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                onFocus={handleFocus}
                                            />
                                            <label htmlFor="postOffice" className="floating-label"></label>
                                        </div>
                                </div>
                                <div className="row-inputs">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            id="street"
                                            className="checkout-select"
                                            placeholder="Вулиця"
                                            value={formData.street}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="postOffice" className="floating-label"></label>
                                    </div>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            id="houseNumber"
                                            className="checkout-select"
                                            placeholder="Номер будинка"
                                            value={formData.houseNumber}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="postOffice" className="floating-label"></label>
                                    </div>
                                </div>
                                <div className="row-inputs input-post-office">
                                    <span className="checkout-post-office-title">Відділення*: </span>
                                    <div >
                                        <input
                                            type="text"
                                            id="postOffice"
                                            className={`checkout-select ${errors.postOffice ? 'invalid-input' : ''}`}
                                            placeholder="Номер"
                                            value={formData.postOffice}
                                            onChange={handleInputChange}
                                            onFocus={handleFocus}
                                        />
                                        <label htmlFor="postOffice" className="floating-label"></label>
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
                                                checked={formData.paymentType === 'card'}
                                                onChange={handleRadioChange}
                                            />
                                            <span className="radio-custom"></span>
                                            <div className="payment-icons-group">
                                                <img src="/img/visa.png" alt="Visa" />
                                            </div>
                                            <span className="radio-label">Оплата на рахунок</span>
                                        </div>
                                    </label>
                                    <hr />
                                    <label className="radio-card payment-card">
                                        <div className="radio-left">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="cod"
                                                checked={formData.paymentType === 'cod'}
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

                    <aside className="order-summary">
                        <h2 className="summary-title">Ваше замовлення</h2>

                        <div className="checkout-items">
                            {cartItems.map(item => {
                                const itemPrice = Number(item.price);
                                const itemQty = item.quantity;
                                const itemDiscount = Number(item.discount) || 0;
                                const priceWithDiscount = itemPrice - (itemPrice * (itemDiscount / 100));

                                return (
                                    <div className="checkout-item" key={item.id}>
                                        <div className="checkout-img">
                                            <img src={getImageUrl(item)} alt={item.name} />
                                        </div>

                                        <div className="checkout-info">
                                            <div>
                                                <h4 className="checkout-name">{item.name}</h4>
                                            </div>

                                            <div className="checkout-controls">
                                                <div className="checkout-qty-and-price">
                                                    <div className="checkout-qty-counter">
                                                        <button
                                                            className="checkout-btn-minus"
                                                            type="button"
                                                            onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                                            disabled={item.quantity <= 1}
                                                        >-</button>
                                                        <input type="text" value={item.quantity} readOnly />
                                                        <button
                                                            className="checkout-btn-plus"
                                                            type="button"
                                                            onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                                        >+</button>
                                                    </div>
                                                    <div className="checkout-item-price checkout-action-mobile">
                                                        {(itemPrice * itemQty).toFixed(0)} грн
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="checkout-remove-btn checkout-action-mobile"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    <img src="/img/trash.svg" alt="delete" />
                                                </button>
                                            </div>

                                            <div>
                                                { item.priceWithoutDiscount !== item.price && (
                                                    <span className="checkout-price-without-discount">
                                                         {item.priceWithoutDiscount}₴
                                                    </span>
                                                )}
                                                <span className="checkout-current-price">
                                                    {item.price.toFixed(2)}₴ за шт.
                                                </span>
                                            </div>
                                        </div>

                                        <div className="checkout-price-action-desktop">
                                            <div style={{textAlign: 'right'}}>
                                                {itemDiscount > 0 && (
                                                    <span className="checkout-old-price" style={{ textDecoration: 'line-through', color: '#999', fontSize: '12px', display: 'block' }}>
                                                        {(itemPrice * itemQty).toFixed(0)} грн
                                                    </span>
                                                )}
                                                <span className="checkout-item-price">
                                                    {(priceWithDiscount * itemQty).toFixed(0)} грн
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                className="checkout-remove-btn"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <img src="/img/trash.svg" alt="delete" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="checkout-order-totals">

                            <div className="checkout-total-row checkout-final-total checkout-together">
                                <span>Разом</span>
                            </div>
                            <div className="checkout-total-row checkout-small-row">
                                <span>{cartItems.length} товари на суму:</span>
                                <span className="checkout-total-amount">{originalTotal.toFixed(0)} грн</span>
                            </div>

                            {discountAmount > 0 && (
                                <div className="checkout-total-row checkout-discount checkout-small-row">
                                    <span>У тому числі знижка:</span>
                                    <span className="checkout-total-discount">-{discountAmount.toFixed(0)} грн</span>
                                </div>
                            )}

                            <div className="checkout-total-row checkout-final-total">
                                <span>До сплати:</span>
                                <span className="checkout-total-pay">{finalTotal.toFixed(0)} грн</span>
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </section>
    );
};

export default Checkout;