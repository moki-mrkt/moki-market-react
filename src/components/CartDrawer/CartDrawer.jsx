import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCart } from '../../contexts/CartContext.jsx';

import './CartDrawer.css';
import {useTranslation} from "react-i18next";

const CartDrawer = ({ isOpen }) => {

    const {
        isCartOpen,
        setIsCartOpen,
        cartItems,
        removeFromCart,
        updateQuantity,
        cartTotal
    } = useCart();

    const navigate = useNavigate();

    const { t } = useTranslation();

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

    const originalTotal = cartItems.reduce((acc, item) => acc + (item.priceWithoutDiscount * item.quantity), 0);
    const finalTotal = Number(cartTotal);
    const discountAmount = originalTotal > finalTotal ? originalTotal - finalTotal : 0;

    const getItemsWord = (count) => {
        const mod10 = count % 10;
        const mod100 = count % 100;
        if (mod10 === 1 && mod100 !== 11) return 'товар';
        if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return t('cart.several-prod');
        return t('cart.else-prod');
    };

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
                    <h3>{t('cart.title')}</h3>
                </div>


                <div className="cart-drawer-body">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart-message">
                            <h3 className="empty-cart-text">{t('cart.empty')}</h3>
                            <button className="btn-continue" onClick={handleClose}>{t('cart.continue')}</button>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div className="cart-item" key={item.id}>
                                <div className="cart-img">
                                    <img src={ item.image ? `${item.image}_thumb.webp` : '/img/icon.png'} alt={item.name} />
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
                                                     {item.priceWithoutDiscount.toFixed(2)}₴
                                           </span>
                                        )}
                                        <span className="item-current-price">
                                            {item.price.toFixed(2)}₴ за {
                                            item.weight
                                                ? (item.weight >= 1000 ? `${item.weight / 1000} кг` : `${item.weight} г`)
                                                : 'шт.'
                                        }
                                        </span>
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
                        <div className="order-totals">
                            <div className="total-row final-total">
                                <span>{t('cart.together')}</span>
                            </div>

                            <div className="total-row small-row">
                                <span>{cartItems.length} {getItemsWord(cartItems.length)} {t('cart.totalrow')}</span>
                                <span>{originalTotal.toFixed(2)} ₴</span>
                            </div>

                            {discountAmount > 0 && (
                                <div className="total-row discount small-row">
                                    <span>{t('cart.discount')}</span>
                                    <span>-{discountAmount.toFixed(2)} ₴</span>
                                </div>
                            )}

                            <div className="total-row final-total">
                                <span>{t('cart.final-total')}</span>
                                <span>{finalTotal.toFixed(2)} ₴</span>
                            </div>
                        </div>

                        <div className="cart-footer-btn">
                            <button className="btn-checkout" onClick={handleCheckout}>
                                {t('cart.order')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;