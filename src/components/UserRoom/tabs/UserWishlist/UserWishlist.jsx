
import React from 'react';
import ProductCard from '../../../ProductCard/ProductCard.jsx'; 
import './UserWishlist.css';

const UserWishlist = () => {
    // Тут мають бути реальні дані з контексту або API
    const wishlistItems = [
        { id: 1, name: "Товар 1", price: 100, images: [{ imageId: '1.jpg', isMain: true }], rating: 5 },
        { id: 2, name: "Товар 2", price: 200, images: [], rating: 4 },
        // ...
    ];

    return (
        <div className="wishlist-wrapper">
            <h2 className="wrapper-title">Улюблені товари</h2>
            {wishlistItems.length > 0 ? (
                <div className="wishlist-goods-grid">
                    {wishlistItems.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <p>Список бажань порожній</p>
            )}
        </div>
    );
};

export default UserWishlist;