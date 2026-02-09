import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

import { useCart } from '../CartContext/CartContext.jsx';

import {URLS} from '../../constants/urls';

const image_api =  URLS.s3_bucket;

const ProductCard = ({product

                     }) => {

    const { addToCart } = useCart();

    const handleBuyClick = (e) => {
        e.preventDefault();
        addToCart(product);
    };


    const mainImage = product.images && product.images.length > 0
        ? product.images.find(img => img.isMain) || product.images[0]
        : null;

    const imageUrl = mainImage
        ? `${image_api}${mainImage.imageId}`
        : '/img/placeholder.png';

    const hasDiscount = product.discount > 0;
    const currentPrice = hasDiscount
        ? (product.price - (product.price * product.discount / 100)).toFixed(2)
        : product.price;

    if (!product) return null;

    return (
        <div className="goods">
            <div className="goods-header">

                {product.discount > 0 && <span className="discount-badge">-{product.discount}%</span>}

                <button className="wishlist-btn" aria-label="Додати в обране">
                    <img src="/img/fav_heart.svg" alt="fav" />
                </button>
            </div>

            <Link to={`/product/${product.id}`} className="goods-image">
                <img src={imageUrl} alt={product.name} />
            </Link>

            <div className="goods-info">
                <div className="goods-title-weight">
                    <Link to={`/product/${product.id}`} className="goods-title">
                        {product.name}
                    </Link>

                    <div className="goods-weight">
                        {product.valueOfInitOfMeasure} {product.initOfMeasure}
                    </div>
                </div>

                <div className="goods-vip">
                    <div className="goods-rating">


                        {product.rating > 0 ? (<div className="goods-stars">
                            {[...Array(5)].map((_, index) => (
                                <img
                                    key={index}
                                    src={index < product.rating ? "/img/star.svg" : "/img/star-outline.svg"}
                                    alt="star"
                                />

                            ))}
                            <span className="card-rating-value"> {product.rating}</span>
                        </div>)
                            :
                            <div className="goods-stars">
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

                    <div className="goods-price">

                       <span className="card-current-price-value">
                              {currentPrice} грн
                         </span>
                        <span>   </span>

                        {hasDiscount && (
                            <span className="card-old-price-value">
                                 {product.price} грн
                             </span>
                        )}

                    </div>

                    <button className="buy-button" onClick={handleBuyClick}>Купити</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;