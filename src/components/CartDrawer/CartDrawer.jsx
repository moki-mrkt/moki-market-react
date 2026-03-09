import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCart } from '../CartContext/CartContext.jsx';

import './CartDrawer.css';

const CartDrawer = ({ isOpen, onClose }) => {

    const {
        isCartOpen,
        setIsCartOpen,
        cartItems,
        removeFromCart,
        updateQuantity,
        cartTotal
    } = useCart();

    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isCartOpen) return null;

    const handleClose = () => setIsCartOpen(false);

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/checkout');
    };

    const handleQuantityChange = (id, currentQty, delta) => {
        const newQty = currentQty + delta;
        updateQuantity(id, newQty);
    };

    console.log(cartItems)

    return (
        <div className="cart-overlay" onClick={handleClose}>
            <div
                className={`cart-drawer ${isOpen ? 'open' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="cart-close-bnt">
                    <button className="close-btn" onClick={handleClose}>
                        <img  src="/img/cross.svg" alt="close"/>
                    </button>
                </div>

                <div className="cart-title">
                    <h3>Кошик</h3>
                </div>


                <div className="cart-drawer-body">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart-message">
                            <h3 className="empty-cart-text">Ваш кошик поки що порожній</h3>
                            <button className="btn-continue" onClick={handleClose}>Продовжити покупки</button>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div className="cart-item" key={item.id}>
                                <div className="cart-img">
                                    <img src={item.image || '/placeholder.png'} alt={item.name} />
                                </div>

                                <div className="cart-info">
                                    <div>
                                        <h4 className="cart-name">{item.name}</h4>
                                    </div>

                                    {/*<span className="item-old-price">{item.itemTotal.toFixed(2)}₴ </span>*/}

                                    <div className="cart-controls">
                                        <div className="qty-and-trash">
                                            <div className="qty-counter">
                                                <button
                                                    className="btn-minus"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <input type="text" value={item.quantity} readOnly />
                                                <button
                                                    className="btn-plus"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                className="remove-btn action-mobile"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <img src="/img/trash.svg" alt="delete" />
                                            </button>
                                        </div>
                                        <div className="item-price action-mobile">
                                            {item.itemTotal.toFixed(2)} ₴
                                        </div>
                                    </div>

                                    <div className="price-per-unit">
                                        { item.priceWithoutDiscount !== item.price && (
                                            <span className="item-price-without-discount">
                                                     {item.priceWithoutDiscount}₴
                                           </span>
                                        )}
                                        <span className="item-current-price">{item.price.toFixed(2)}₴ за шт.</span>
                                    </div>
                                </div>

                                <div className="cart-price-action-desktop">
                                    <div>
                                        <span className="item-price">{item.itemTotal.toFixed(2)}₴</span>
                                    </div>

                                    <button
                                        className="remove-btn"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <img src="/img/trash.svg" alt="delete" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-drawer-footer">
                        <div className="total-price">
                            <span>Разом:</span>
                            <span>{Number(cartTotal).toFixed(2)} ₴</span>
                        </div>
                        <div className="cart-footer-btn">
                            <button className="btn-checkout" onClick={handleCheckout}>
                                Оформити замовлення
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;