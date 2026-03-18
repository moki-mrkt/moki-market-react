import React, { useEffect, useState } from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import ProductSlider from '../ProductSlider/ProductSlider';

import { useCart } from '../../contexts/CartContext.jsx';

import { getLabelFromSlug } from '../../constants/categories';

import { productService } from '../../services/productService';

import ProductGallery from './ProductGallery';
import ProductTabs from './ProductTabs';

import './Product.css';
import {authService} from "../../services/authService.js";
import {favoriteProductService} from "../../services/favoriteProductService.js";
import toast from "react-hot-toast";

const Product = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const { addToCart } = useCart();
    const [qty, setQty] = useState(1);

    const { categorySlug, productSlug } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [similarProducts, setSimilarProducts] = useState([]);

    const [isFav, setIsFav] = useState(false);

    const categoryName = categorySlug ? getLabelFromSlug(categorySlug) : 'Каталог';

    const productBreadcrumbs = [
        { path: '/', breadcrumb: 'Головна' },
        { path: '/catalog', breadcrumb: 'Каталог' },

        ...(categorySlug ? [{
            path: `/catalog/${categorySlug}`,
            breadcrumb: categoryName
        }] : []),
        { path: null, breadcrumb: product?.name || 'Товар' }
    ];

    const handleForBuyOneClick = (product) => {
        addToCart(product, 1, false );
        navigate('/checkout');
    };

    useEffect(() => {

        const fetchProductData = async () => {
            setLoading(true);
            try {

                const data = await productService.getBySlug(productSlug);

                if (data) {
                    setProduct(data);
                    setIsFav(data.isFavorite || false);

                    if (data.productCategory) {
                        const similar = await productService.search({
                            category: data.productCategory,
                            size: 6
                        });

                        const content = similar.products.content || [];
                        setSimilarProducts(content.filter(p => p.id !== data.id));
                    }
                }
            } catch (error) {
                console.error("Error loading product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
        window.scrollTo(0, 0);
    }, [productSlug]);

    if (loading) return <div className="loader">Завантаження...</div>;
    if (!product) return <div className="not-found">Товар не знайдено</div>;

    const hasDiscount = product.discount && product.discount > 0;
    const currentPrice = hasDiscount ? (product.price  - (product.price * product.discount / 100)).toFixed(2) : product.price

    const oldPrice = hasDiscount ? product.price : null;

    const isAvailable = product.availability === 'IN_STOCK';

    const handleHeartClick = async (e) => {
        e.preventDefault();

        if (!authService.isAuthenticated()) {
            navigate(`${location.pathname}?login=true`);
            return;
        }

        const previousState = isFav;
        setIsFav(!isFav);

        try {
            if (previousState) {
                await favoriteProductService.removeFavorite(product.id);
            } else {
                await favoriteProductService.addFavorite(product.id);
            }
        } catch (error) {
            setIsFav(previousState);
            toast.error("Не вдалося оновити улюблені");
        }
    };

    return (
        <>
            <main className="hero-section">
                <div className="container hero__grid">

                    <Breadcrumbs customCrumbs={productBreadcrumbs} />

                    <div className="product-card">
                        <div className="product-header">

                            <div className="product-gallery-wrapper">
                                <ProductGallery images={product.images || []}
                                                fallbackImage="../../img/categories/nuts.png" />
                            </div>

                            <div className="product-info">
                                <div className="product-info-top">
                                    <h2 className="product-name">{product.name}</h2>

                                    <div className="product-rating-wrapper">
                                        {product.rating > 0 ? (
                                            <div className="product-rating">
                                                <div className="product-stars">
                                                    {[...Array(5)].map((_, index) => (
                                                        <img
                                                            key={index}
                                                            src={index < product.rating ? "/img/star.svg" : "/img/star-outline.svg"}
                                                            alt="star"
                                                        />

                                                    ))}
                                                </div>
                                                <span className="product-rating-value"> {product.rating}</span>
                                            </div>)
                                            :
                                            <div className="product-stars">
                                                {[...Array(5)].map((_, index) => (
                                                    <img
                                                        key={index}
                                                        src="/img/star.svg"
                                                        alt="star"
                                                        style={{ opacity:  0.5 }}
                                                    />
                                                ))}
                                            </div>
                                        }
                                    </div>

                                    <div>
                                        <div className="price-block">
                                            <div className="current-price">
                                                <span className="current-price-value">{currentPrice}</span>
                                                <span className="current-price-text">грн</span>
                                            </div>
                                            {hasDiscount === true && (
                                                <div className="old-price">
                                                    <span className="old-price-value">{oldPrice}</span>
                                                    <span className="old-price-text">грн</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="init-measure">
                                        за <span> {product.valueOfInitOfMeasure}</span>
                                        <span>{product.initOfMeasure}</span>
                                    </div>
                                </div>

                                <div className="product-info-bottom">
                                    <div className="product-status-row">
                                        <div className={`availability ${isAvailable ? '' : 'out-of-stock'}`}>
                                            {isAvailable ? 'Є в наявності' : 'Немає в наявності'}
                                        </div>

                                        <button className="btn-wishlist-desktop" onClick={handleHeartClick}>
                                            <img src={isFav ? "/img/heart-filled.svg" : "/img/heart-outline.svg"}
                                                 alt="favorite"
                                            />
                                            <span>{isFav ? 'В списку бажаного' : 'Додати в список бажаного'}</span>
                                        </button>

                                        <button className="btn-wishlist-mobile" onClick={handleHeartClick}>
                                            <img
                                                src={isFav ? "/img/heart-filled.svg" : "/img/heart-outline.svg"}
                                                alt="favorite"
                                            />
                                        </button>
                                    </div>

                                    <div className="product-buttons-row">
                                        <button className="btn-cart-primary" onClick={() => addToCart(product, qty)}>
                                            <img src="/img/white_cart.png" alt="cart" />
                                            До кошика
                                        </button>
                                        <button className="btn-one-click" onClick={() => handleForBuyOneClick(product)}>
                                            <img src="/img/blue_cart.png" alt="buy" />
                                            Купити в один клік
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ProductTabs
                            productId={product.id}
                            description={product.description}
                            characteristics={product.characteristics}
                        />
                    </div>

                    {similarProducts.length > 0 && (
                        <div className="other-product">
                            <ProductSlider
                                title="Схожі товари"
                                products={similarProducts}
                            />
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default Product;