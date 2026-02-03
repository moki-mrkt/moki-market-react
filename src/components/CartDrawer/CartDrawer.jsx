// src/components/CartDrawer/CartDrawer.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, onClose }) => {

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
            image: '/img/categories/tea.png'
        },
        {
            id: 3,
            name: 'Фісташкова паста 200г',
            price: 120,
            quantity: 1,
            image: '/img/categories/tea.png'
        },
        {
            id: 4,
            name: 'Фісташкова паста 200г',
            price: 120,
            quantity: 1,
            image: '/img/categories/tea.png'
        },
        {
            id: 5,
            name: 'Фісташкова паста 200г',
            price: 120,
            quantity: 1,
            image: '/img/categories/tea.png'
        },
        {
            id: 6,
            name: 'Фісташкова паста 200г',
            price: 120,
            quantity: 1,
            image: '/img/categories/tea.png'
        }
    ]);

    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCheckout = () => {
        onClose();
        navigate('/cart'); // Перехід на повноцінну сторінку оформлення
    };

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

    return (
        <div className="cart-overlay" onClick={onClose}>
            <div
                className={`cart-drawer ${isOpen ? 'open' : ''}`}
                onClick={(e) => e.stopPropagation()} // Щоб клік по самому кошику не закривав його
            >
                <div className="cart-close-bnt">
                    <button className="close-btn" onClick={onClose}>
                        <img  src="/img/cross.svg" alt="close"/>
                    </button>
                </div>

                <div className="cart-title">
                    <h3>Кошик</h3>
                </div>


                <div className="cart-drawer-body">
                    {/* ТУТ БУДЕ СПИСОК ТОВАРІВ */}
                    {/* Поки що заглушка, пізніше підключите сюди масив товарів */}
                    {/*<p className="empty-cart-text">Ваш кошик поки що порожній</p>*/}

                    {/* Приклад товару (розкоментуйте, коли будуть дані)
                    <div className="drawer-item">
                        <img src="..." alt="img" />
                        <div className="drawer-item-info">
                            <h4>Назва товару</h4>
                            <span>1 x 120 грн</span>
                        </div>
                    </div>
                    */}
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

                <div className="cart-drawer-footer">
                    <div className="total-price">
                        <span>Разом:</span>
                        <span>0 грн</span>
                    </div>
                    <div className="cart-footer-btn">
                        <button className="btn-checkout" onClick={handleCheckout}>
                            Оформити замовлення
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CartDrawer;