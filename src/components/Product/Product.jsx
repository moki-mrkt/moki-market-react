import React, { useEffect, useState } from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';

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
import {Helmet} from "react-helmet-async";
import {useTranslation} from "react-i18next";

const Product = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const { addToCart } = useCart();
    const [qty, setQty] = useState(1);

    const { categorySlug, productSlug } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [selectedWeight, setSelectedWeight] = useState(null);
    const [customWeight, setCustomWeight] = useState('');
    const [customWeightUnit, setCustomWeightUnit] = useState('г');

    const [isFav, setIsFav] = useState(false);
    const { t, i18n } = useTranslation();

    const categoryName = categorySlug ? getLabelFromSlug(categorySlug) : t('header.catalog');

    const productBreadcrumbs = [
        { path: '/', breadcrumb: t('header.main') },
        { path: '/catalog', breadcrumb: t('header.catalog') },

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
                const data = await productService.getBySlug(productSlug);
                if (data) {
                    setProduct(data);
                    setIsFav(data.isFavorite || false);

                    if (data.productType === 'WEIGHT_BASED' && data.weightOptions?.length > 0) {

                        const queryParams = new URLSearchParams(location.search);
                        const urlWeight = queryParams.get('weight');

                        let defaultOpt = data.weightOptions.find(opt => opt.isDefault) || data.weightOptions[0];

                        if (urlWeight) {
                            const exactOpt = data.weightOptions.find(opt => Number(opt.weightValue) === Number(urlWeight));
                            if (exactOpt) {
                                defaultOpt = exactOpt;
                            }
                        }
                        setSelectedWeight(defaultOpt);
                        setCustomWeight('');
                    }

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
    }, [productSlug, i18n.language, location.search]);

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
            toast.error(t('product-card.error-reload'));
        }
    };

    const handleForBuyOneClick = (product) => {
        addToCart(product, 1, selectedWeight?.weightValue);
        navigate('/checkout');
    };

    const handleFixedWeightSelect = (opt) => {
        setSelectedWeight(opt);
        setCustomWeight('');
    };

    const handleCustomWeightChange = (e) => {

        let value = e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.');

        const dotCount = (value.match(/\./g) || []).length;
        if (dotCount > 1) {
            value = value.substring(0, value.lastIndexOf('.'));
        }

        setCustomWeight(value);
        if (value) {
            setSelectedWeight(null);
        }
    };

    let customWeightInGrams = 0;
    if (customWeight) {
        const parsedWeight = parseFloat(customWeight);
        if (!isNaN(parsedWeight)) {
            customWeightInGrams = customWeightUnit === 'кг'
                ? Math.round(parsedWeight * 1000)
                : Math.round(parsedWeight);
        }
    }

    const currentWeightToCart = customWeightInGrams > 0 ? customWeightInGrams : selectedWeight?.weightValue;

    const handleAddToCartClick = (isOneClick = false) => {
        let finalWeightToCart = null;

        if (product.productType === 'WEIGHT_BASED') {
            if (!currentWeightToCart || currentWeightToCart === 0) {
                toast.error("Будь ласка, оберіть або введіть вагу");
                return;
            }
            if (customWeight && currentWeightToCart < product.minCustomWeight) {
                toast.error(`Мінімальна вага для замовлення: ${product.minCustomWeight >= 1000 ? product.minCustomWeight/1000 + ' кг' : product.minCustomWeight + ' г'}`);
                return;
            }
            finalWeightToCart = currentWeightToCart;
        }

        if (isOneClick) {
            addToCart(product, 1, finalWeightToCart);
            navigate('/checkout');
        } else {
            addToCart(product, qty, finalWeightToCart);
        }
    };

    const hasDiscount = product?.discount && product.discount > 0;

    let basePrice = product?.price || 0;
    if (product?.productType === 'WEIGHT_BASED') {
        if (customWeightInGrams > 0 && product.price) {
            // Рахуємо від ціни за кг
            basePrice = (customWeightInGrams / 1000) * product.price;
        } else if (selectedWeight) {
            basePrice = selectedWeight.price;
        }
    }

    const formatPrice = (price) => Number.isInteger(price) ? price : price.toFixed(2);

    const currentPrice = product
        ? (hasDiscount ? formatPrice(basePrice - (basePrice * product.discount / 100)) : formatPrice(basePrice))
        : 0;
    const oldPrice = hasDiscount ? formatPrice(basePrice) : null;

    const isAvailable = product?.availability === 'IN_STOCK';

    const stripHtml = (html) => {
        if (!html) return "";
        return html.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 160);
    };

    const cleanDescription = product ? stripHtml(product.shortDescription || product.description) : "";
    const siteUrl = "https://moki.com.ua";
    const absoluteImageUrl = product?.images?.[0]
        ? (product.images[0].imageId.startsWith('http') ? product.images[0].imageId : `${siteUrl}${product.images[0].imageId}`)
        : `${siteUrl}/img/icon.png`;

    return (
        <>
            <Helmet>
                <title>
                    {product ? `${t('product-card.buy')} ${product.name} в Moki` : t('product-card.dowloading')}
                </title>

                {product && (
                    <>
                        <meta name="description" content={cleanDescription || t('product-card.quality')} />
                        <link rel="canonical" href={`${siteUrl}/products/${productSlug}`} />
                        <meta property="og:type" content="product" />
                        <meta property="og:title" content={product.name} />
                        <meta property="og:description" content={cleanDescription} />
                        <meta property="og:image" content={absoluteImageUrl} />
                        <meta property="og:url" content={window.location.href} />
                        <meta name="twitter:card" content="summary_large_image" />
                        <meta name="twitter:title" content={product.name} />
                        <meta name="twitter:description" content={cleanDescription} />
                        <meta name="twitter:image" content={absoluteImageUrl} />

                        <script type="application/ld+json">
                            {JSON.stringify({
                                "@context": "https://schema.org/",
                                "@type": "Product",
                                "name": product.name,
                                "image": product.images?.map(img => img.imageId.startsWith('http') ? img.imageId : `${siteUrl}/${img.imageId}`),
                                "description": cleanDescription,
                                "sku": product.id,
                                "brand": {
                                    "@type": "Brand",
                                    "name": "Moki"
                                },
                                "offers": {
                                    "@type": "Offer",
                                    "url": window.location.href,
                                    "priceCurrency": "UAH",
                                    "price": currentPrice,
                                    "itemCondition": "https://schema.org/NewCondition",
                                    "availability": isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                                    "seller": {
                                        "@type": "Organization",
                                        "name": "Moki Market"
                                    }
                                },
                                "aggregateRating": product.rating > 0 ? {
                                    "@type": "AggregateRating",
                                    "ratingValue": product.rating,
                                    "reviewCount": product.reviewsCount || 1
                                } : undefined
                            })}
                        </script>
                    </>
                )}
            </Helmet>

            {loading ? (
                <div className="loader">{t('product-card.dowloading')}</div>
            ) : !product ? (
                <div className="not-found">{t('product-card.not_found')}</div>
            ) : (
                <main className="hero-section">
                    <div className="container hero__grid">

                        <Breadcrumbs customCrumbs={productBreadcrumbs} />

                        <div className="product-card">
                            <div className="product-header">

                                <div className="product-gallery-wrapper">
                                    <ProductGallery images={product.images || []}
                                                    fallbackImage="../../img/categories/nuts.png"
                                                    productName={product.name}
                                    />
                                </div>

                                <div className="product-info">
                                    <div className="product-info-top">
                                        <h1 className="product-name">{product.name}</h1>

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
                                                </div>
                                            ) : (
                                                <div className="product-stars">
                                                    {[...Array(5)].map((_, index) => (
                                                        <img
                                                            key={index}
                                                            src="/img/star.svg"
                                                            alt="star"
                                                            style={{ opacity: 0.5 }}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="price-block">
                                                <div className="current-price">
                                                    <span className="current-price-value">{currentPrice}</span>
                                                    <span className="current-price-text"> ₴</span>
                                                </div>
                                                {hasDiscount === true && (
                                                    <div className="old-price">
                                                        <span className="old-price-value">{oldPrice}</span>
                                                        <span className="old-price-text"> ₴</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {product.productType === 'WEIGHT_BASED' ? (
                                            <div className="weight-section">
                                                {product.weightOptions?.length > 0 && (
                                                    <div className="weight-options-container">
                                                        {product.weightOptions.map(opt => (
                                                            <button
                                                                key={opt.id || opt.weightValue}
                                                                className={`weight-option-btn ${selectedWeight?.weightValue === opt.weightValue ? 'active' : ''}`}
                                                                onClick={() => handleFixedWeightSelect(opt)}
                                                            >
                                                                {opt.weightValue >= 1000 ? `${opt.weightValue / 1000} кг` : `${opt.weightValue} г`}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                {product.allowCustomWeight && (
                                                    <div className="custom-weight-container">
                                                        <span className="custom-weight-label">{t('product-card.custom-weight')}</span>
                                                        <div className="custom-weight-input-wrapper">
                                                            <input
                                                                type="text"
                                                                className="custom-weight-input"
                                                                placeholder={customWeightUnit === 'кг' ? 'напр. 1.5' : 'напр. 350'}
                                                                value={customWeight}
                                                                onChange={handleCustomWeightChange}
                                                            />
                                                            <select
                                                                className="custom-weight-unit-select"
                                                                value={customWeightUnit}
                                                                onChange={(e) => setCustomWeightUnit(e.target.value)}
                                                            >
                                                                <option value="г">г</option>
                                                                <option value="кг">кг</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : product.productType === 'VARIANT' && product.siblingVariants?.length > 0 ? (
                                            <div className="weight-section">

                                                <div className="weight-options-container">
                                                    {product.siblingVariants.map(variant => (
                                                        <button
                                                            key={variant.productId}
                                                            className={`weight-option-btn ${variant.isCurrent ? 'active' : ''}`}
                                                            onClick={() => navigate(`/products/${variant.slug}`)}
                                                        >
                                                            {variant.variantValue}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="init-measure">
                                                <span>за {product.valueOfInitOfMeasure}</span>
                                                <span>{product.initOfMeasure}</span>
                                            </div>
                                        )}
                                    </div> {/* Кінець product-info-top */}

                                    <div className="product-info-bottom">
                                        <div className="product-status-row">
                                            <div className={`availability ${isAvailable ? '' : 'out-of-stock'}`}>
                                                {isAvailable ? t('product-card.available') : t('product-card.not_available')}
                                            </div>

                                            {/* Кнопки улюбленого (Wishlist) */}
                                            <button className="btn-wishlist-desktop" onClick={handleHeartClick}>
                                                <img src={isFav ? "/img/heart-filled.svg" : "/img/heart-outline.svg"} alt="favorite" />
                                                <span>{isFav ? t('product-card.in_wishlist') : t('product-card.not_wishlist')}</span>
                                            </button>
                                            <button className="btn-wishlist-mobile" onClick={handleHeartClick}>
                                                <img src={isFav ? "/img/heart-filled.svg" : "/img/heart-outline.svg"} alt="favorite" />
                                            </button>
                                        </div>

                                        <div className="product-buttons-row">
                                            <button
                                                className="btn-cart-primary"
                                                onClick={() => handleAddToCartClick(false)}
                                            >
                                                <img src="/img/white_cart.png" alt="cart" />
                                                {t('product-card.to_cart')}
                                            </button>
                                            <button
                                                className="btn-one-click"
                                                onClick={() => handleAddToCartClick(true)}
                                            >
                                                <img src="/img/blue_cart.png" alt="buy" />
                                                {t('product-card.one_click')}
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
                                    title={t('product-card.other_product')}
                                    products={similarProducts}
                                />
                            </div>
                        )}

                    </div>
                </main>
            )}
        </>
    );
};

export default Product;