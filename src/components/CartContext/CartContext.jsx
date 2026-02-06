import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // 1. Ініціалізуємо стан з localStorage
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCart = localStorage.getItem('guest_cart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error("Помилка читання кошика:", error);
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    // 2. Слідкуємо за змінами і пишемо в localStorage
    useEffect(() => {
        localStorage.setItem('guest_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // 3. Функції управління
    const addToCart = (product, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                // Якщо товар вже є, збільшуємо кількість
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            // Якщо немає, додаємо новий
            return [...prev, { ...product, quantity }];
        });
        setIsCartOpen(true); // Відкриваємо шторку при додаванні
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prev =>
            prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    // Підрахунки
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.priceWithDiscount * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isCartOpen,
            setIsCartOpen,
            cartCount,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};