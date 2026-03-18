import React from 'react';
import { URLS } from '../../constants/urls.js';

import './FeedbackCard.css';
import {useNavigate} from "react-router-dom";

const image_api = URLS.s3_bucket;

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const FeedbackCard = ({ feedback, showActions = false, onDelete }) => {
    const navigate = useNavigate();
    if (!feedback) return null;

    const handleGoToProduct = () => {
        const productSlug = feedback.product?.slug || feedback.productSlug;
        const categorySlug = feedback.product?.category?.slug || 'all';

        if (productSlug) {
            navigate(`/catalog/${categorySlug}/${productSlug}?tab=reviews`);
        } else {
            console.warn("Не вдалося знайти посилання на товар");
        }
    };

    return (
        <div className="feedback-card">
            <div className="feedback-header">
                <div className="avatar-circle">
                    <img
                        className="avatar-img"
                        src={feedback.userImageUrl ? `${image_api}${feedback.userImageUrl}` : "/img/white_user.svg"}
                        alt={feedback.firstNameUser || 'User'}
                    />
                </div>

                <div className="feedback-meta-info">
                    <div className="feedback-info">
                        <span className="feedback-author">
                            {feedback.firstNameUser || 'Клієнт'}
                        </span>
                    </div>
                    <div className="feedback-stars-and-date">
                        <p className="product-feedback-date">
                            {formatDate(feedback.createdAt)}
                        </p>
                        <div className="feed-stars">
                            {[...Array(5)].map((_, index) => (
                                <img
                                    key={index}
                                    src={index < feedback.rating ? "/img/star.svg" : "/img/star-outline.svg"}
                                    alt="star"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <p className="review-text">{feedback.comment}</p>

            {feedback.answer && (
                <div className="admin-reply">
                    <div className="admin-header">
                        <img src="/icon.png" alt="Moki" />
                        <div className="name-and-date">
                            <div className="name">Moki</div>
                            <div className="date">{formatDate(feedback.answeredAt)}</div>
                        </div>
                    </div>
                    <p className="review-text">{feedback.answer}</p>
                </div>
            )}

            {showActions && (
                <div className="feedback-action-block">
                    <button
                        className="feedback-to-product-btn"
                        onClick={handleGoToProduct}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#EEF2FF' }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                        Перейти до товару
                    </button>

                    <button
                        className="feedback-delete-btn"
                        onClick={() => onDelete(feedback.id)}
                        onMouseOver={(e) => { e.currentTarget.style.opacity = '0.7' }}
                        onMouseOut={(e) => { e.currentTarget.style.opacity = '1' }}
                    >
                        Видалити
                    </button>
                </div>
            )}
        </div>
    );
};

export default FeedbackCard;