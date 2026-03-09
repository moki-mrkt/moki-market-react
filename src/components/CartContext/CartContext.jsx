import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

import { authService } from '../../services/authService';
import { cartService } from '../../services/cartService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {

    const updateTimeouts = useRef({});

    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [serverTotal, setServerTotal] = useState(null);

    const mapDtoToItem = (dtoItem) => ({
        id: dtoItem.productId,
        name: dtoItem.productName,
        image: dtoItem.productImage,
        price: dtoItem.currentPrice,
        priceWithoutDiscount: dtoItem.productPrice,
        quantity: dtoItem.quantity,
        itemTotal: dtoItem.totalPrice
    });

    const mapProductToItem = (product, qty) => {

        console.log(product);
        const price = product.priceWithDiscount || product.price;
        const image = product.image || (product.images && product.images.length > 0 ? product.images[0].imageUrl : '/placeholder.png');
        return {
            id: product.id,
            name: product.name || product.productName,
            image: image,
            price: price,
            priceWithoutDiscount: product.price,
            quantity: qty,
            itemTotal: price * qty
        };
    };

    useEffect(() => {
        if (authService.isAuthenticated()) {
            syncCartWithServer();
        } else {
            try {
                const storedCart = localStorage.getItem('guest_cart');
                if (storedCart) setCartItems(JSON.parse(storedCart));
            } catch (error) {
                console.error("Помилка читання кошика:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            localStorage.setItem('guest_cart', JSON.stringify(cartItems));
        }
    }, [cartItems]);

    const syncCartWithServer = async () => {
        try {
            const serverCart = await cartService.getCart();
            if (serverCart && serverCart.items) {
                setCartItems(serverCart.items.map(mapDtoToItem));
                setServerTotal(serverCart.totalCartPrice);
            }
        } catch (error) {
            console.error("Помилка синхронізації кошика з сервером:", error);
        }
    };

    const addToCart = async (product, quantity = 1, setCartOpen = true) => {
        const newItem = mapProductToItem(product, quantity);

        setCartItems(prev => {
            const existing = prev.find(item => item.id === newItem.id);
            if (existing) {
                return prev.map(item =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + quantity, itemTotal: item.price * (item.quantity + quantity) }
                        : item
                );
            }
            return [...prev, newItem];
        });

        setIsCartOpen(setCartOpen);

        if (authService.isAuthenticated()) {
            try {
                setServerTotal(null);
                const updatedCartDto = await cartService.addToCart(product.id, quantity);

                // Записуємо нормалізовані дані
                setCartItems(updatedCartDto.items.map(mapDtoToItem));
                setServerTotal(updatedCartDto.totalCartPrice);
            } catch (error) {
                console.error("Помилка збереження товару в БД", error);
            }
        }
    };

    const removeFromCart = async (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));

        if (authService.isAuthenticated()) {
            try {
                setServerTotal(null);
                const updatedCartDto = await cartService.removeFormCart(productId);

                setCartItems(updatedCartDto.items.map(mapDtoToItem));
                setServerTotal(updatedCartDto.totalCartPrice);
            } catch (error) {
                console.error("Помилка видалення товару з БД", error);
            }
        }
    };

    const updateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) return;

        setCartItems(prev =>
            prev.map(item => item.id === id
                ? { ...item, quantity: newQuantity, itemTotal: item.price * newQuantity }
                : item)
        );

        if (authService.isAuthenticated()) {

            if (updateTimeouts.current[id]) {
                clearTimeout(updateTimeouts.current[id]);
            }

            updateTimeouts.current[id] = setTimeout(async() => {
                try {
                    setServerTotal(null);
                    const updatedCartDto = await cartService.updateQuantity(id, newQuantity);

                    setCartItems(updatedCartDto.items.map(mapDtoToItem));
                    setServerTotal(updatedCartDto.totalCartPrice);
                } catch (error) {
                    console.error("Помилка оновлення кількості в БД", error);
                } finally {
                    delete updateTimeouts.current[id];
                }
             }, 800);
        }
    };

    const clearCart = () => {
        setCartItems([]);
        setServerTotal(null);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = serverTotal !== null
        ? serverTotal
        : cartItems.reduce((acc, item) => acc + item.itemTotal, 0);

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
            cartTotal,
            syncCartWithServer
        }}>
            {children}
        </CartContext.Provider>
    );
};