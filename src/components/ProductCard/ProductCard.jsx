import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const image_api = 'http://localhost:9000/moki-images/';

const ProductCard = ({
                         id,
                         name,
                         initOfMeasure,
                         valueOfInitOfMeasure,
                         price,
                         images,
                         discount,
                         rating = 0
                     }) => {

    const mainImage = images && images.length > 0
        ? images.find(img => img.isMain) || images[0]
        : null;

    const imageUrl = mainImage
        ? `${image_api}${mainImage.imageId}`
        : '/img/placeholder.png';

    const hasDiscount = discount > 0;
    const currentPrice = hasDiscount
        ? (price - (price * discount / 100)).toFixed(2)
        : price;

    return (
        <div className="goods">
            <div className="goods-header">

                {discount > 0 && <span className="discount-badge">-{discount}%</span>}

                <button className="wishlist-btn" aria-label="Додати в обране">
                    <img src="/img/fav_heart.svg" alt="fav" />
                </button>
            </div>

            <Link to={`/product/${id}`} className="goods-image">
                <img src={imageUrl} alt={name} />
            </Link>

            <div className="goods-info">
                <div className="goods-title-weight">
                    <Link to={`/product/${id}`} className="goods-title">
                        {name}
                    </Link>

                    <div className="goods-weight">
                        {valueOfInitOfMeasure} {initOfMeasure}
                    </div>
                </div>

                <div className="goods-vip">
                    <div className="goods-rating">


                        {rating > 0 ? (<div className="goods-stars">
                            {[...Array(5)].map((_, index) => (
                                <img
                                    key={index}
                                    src={index < rating ? "/img/star.svg" : "/img/star-outline.svg"}
                                    alt="star"
                                />

                            ))}
                            <span className="card-rating-value"> {rating}</span>
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
                                 {price} грн
                             </span>
                        )}

                    </div>

                    <button className="buy-button">Купити</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;