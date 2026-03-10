
import React, {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import ProductCard from '../../../ProductCard/ProductCard.jsx';

import { favoriteProductService } from '../../../../services/favoriteProductService.js';

import './UserWishlist.css';

const UserWishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const pageSize = 10;

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            try {
                const data = await favoriteProductService.getUserFavorites(page, pageSize);

                setWishlistItems(data.content || []);
                setTotalPages(data.page?.totalPages || 0);
            } catch (error) {
                console.error("Помилка завантаження улюблених товарів:", error);
                toast.error("Не вдалося завантажити список бажань");
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    const handleFavoriteToggle = (productId, isNowFavorite) => {
        if (!isNowFavorite) {
            setWishlistItems(prev => prev.filter(item => item.id !== productId));
        }
    };

    return (
        <div className="wishlist-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
            <h2 className="wrapper-title">Улюблені товари</h2>

            {loading && wishlistItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 0', color: '#0E2CA4' }}>
                    <h3>Завантаження...</h3>
                </div>
            ) : wishlistItems.length > 0 ? (
                <>
                    <div
                        className="wishlist-goods-grid"
                        style={{
                            opacity: loading ? 0.5 : 1,
                            pointerEvents: loading ? 'none' : 'auto',
                            transition: 'opacity 0.2s ease-in-out',
                            marginBottom: '30px'
                        }}
                    >
                        {wishlistItems.map(product => (
                            <ProductCard key={product.id}
                                         product={product}
                                         onFavoriteToggle={handleFavoriteToggle}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pag-block">
                            <button
                                onClick={() => setPage(p => p - 1)}
                                className="pag-button"
                                style={{
                                    visibility: page > 0 ? 'visible' : 'hidden'
                                }}
                            >
                                Попередня
                            </button>

                            <span className="pag-text" style={{ padding: '5px', color: '#0E2CA4', minWidth: '130px', textAlign: 'center' }}>
                                Сторінка {page + 1} з {totalPages}
                            </span>

                            <button
                                onClick={() => setPage(p => p + 1)}
                                className="pag-button"
                                style={{
                                    visibility: page < totalPages - 1 ? 'visible' : 'hidden'
                                }}
                            >
                                Наступна
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '50px 0', color: '#0E2CA4' }}>
                    <p>Список бажань порожній</p>
                </div>
            )}
        </div>
    );
};

export default UserWishlist;