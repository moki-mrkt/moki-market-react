import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import ProductSlider from '../ProductSlider/ProductSlider';

import { useCart } from '../CartContext/CartContext.jsx';

import { getLabelFromSlug } from '../../constants/categories';

import { productService } from '../../services/productService';

import ProductGallery from './ProductGallery';
import ProductTabs from './ProductTabs';

import './Product.css';

const PageProduct = () => {

    const { addToCart } = useCart();
    const [qty, setQty] = useState(1);

    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [similarProducts, setSimilarProducts] = useState([]);

    const categorySlug = product?.productCategory?.toLowerCase();
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

    useEffect(() => {

        const fetchProductData = async () => {
            setLoading(true);
            try {

                const data = await productService.getById(productId);

                if (data) {
                    setProduct(data);

                    if (data.productCategory) {
                        const similar = await productService.search({
                            category: data.productCategory,
                            size: 6
                        });

                        const content = similar.products.content || [];
                        console.log(content);
                        setSimilarProducts(content.filter(p => p.id !== data.id));
                    }
                }
            } catch (error) {
                console.error("Error loading product:", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProductData();
            window.scrollTo(0, 0);
        }
    }, [productId]);

    if (loading) return <div className="loader">Завантаження...</div>;
    if (!product) return <div className="not-found">Товар не знайдено</div>;

    const hasDiscount = product.discount && product.discount > 0;
    const currentPrice = hasDiscount ? (product.price  - (product.price * product.discount / 100)).toFixed(2) : product.price

    const oldPrice = hasDiscount ? product.price : null;

    const isAvailable = product.availability === 'IN_STOCK';

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


                                    <div className="product-rating">
                                        {product.rating > 0 ? (<div className="product-stars">
                                                {[...Array(5)].map((_, index) => (
                                                    <img
                                                        key={index}
                                                        src={index < product.rating ? "/img/star.svg" : "/img/star-outline.svg"}
                                                        alt="star"
                                                    />

                                                ))}
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

                                    <div className="price-block">
                                        <div className="current-price">

                                            <span className="current-price-value">{currentPrice}</span>
                                            <span className="current-price-text">грн/</span>
                                            <span className="current-price-text unit-of-measurement">шт</span>
                                        </div>
                                        {hasDiscount == true && (
                                            <div className="old-price">
                                                <span className="old-price-value">{oldPrice}</span>
                                                <span className="old-price-text">грн/</span>
                                                <span className="old-price-text unit-of-measurement">шт</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="product-info-bottom">
                                    <div className="product-status-row">
                                        <div className={`availability ${isAvailable ? '' : 'out-of-stock'}`}>
                                            {isAvailable ? 'Є в наявності' : 'Немає в наявності'}
                                        </div>

                                        <button className="btn-wishlist-desktop">
                                            <img src="../../img/fav_heart.svg" alt="fav" />
                                            <span>Додати в список бажаного</span>
                                        </button>

                                        <button className="btn-wishlist-mobile">
                                            <img src="../../img/fav_heart.svg" alt="fav" />
                                        </button>
                                    </div>

                                    <div className="product-buttons-row">
                                        <button className="btn-cart-primary" onClick={() => addToCart(product, qty)}>
                                            <img src="../../img/white_cart.png" alt="cart" />
                                            До кошика
                                        </button>
                                        <button className="btn-one-click">
                                            <img src="../../img/blue_cart.png" alt="buy" />
                                            Купити в один клік
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ProductTabs description={product.description}
                                     characteristics={product.characteristics}/>
                    </div>

                    {similarProducts.length > 0 && (
                        <div className="other-product">
                            <ProductSlider title="Схожі товари" products={similarProducts} />
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default PageProduct;