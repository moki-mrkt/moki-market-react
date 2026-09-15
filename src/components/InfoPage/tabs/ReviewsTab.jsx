import React, { useEffect, useState } from 'react';
import { feedbackService } from '../../../services/feedbackService';
import FeedbackCard from "../../FeedbackCard/FeedbackCard.jsx";
import {authService} from "../../../services/authService.js";
import {useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import { useTranslation } from 'react-i18next';

const ReviewsTab = () => {

    const navigate = useNavigate();
    const { t } = useTranslation();

    const [reviews, setReviews] = useState([]);
    const [storeRating, setStoreRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 5;
    const [loading, setLoading] = useState(false);

    const fetchReviews = async (pageNum) => {
        try {
            setLoading(true);
            const data = await feedbackService.getStoreFeedbacks(pageNum, pageSize);

            setStoreRating(data.storeRating);
            setTotalReviews(data.feedbacks.page.totalElements);
            setTotalPages(data.feedbacks.page.totalPages);

            if (pageNum === 0) {
                setReviews(data.feedbacks.content);
            } else {
                setReviews(prev => [...prev, ...data.feedbacks.content]);
            }
        } catch (error) {
            console.error("Помилка завантаження відгуків:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews(0);
    }, []);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchReviews(nextPage);
    };

    const handleAddFeedbackClick = () => {
        if (authService.isAuthenticated()) {
            navigate('/profile/reviews');
        } else {
            navigate(`${location.pathname}?login=true&redirect=reviews`);
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="feed-stars">
                {[...Array(5)].map((_, index) => (
                    <img
                        key={index}
                        src={index < rating ? "/img/star.svg" : "/img/star-outline.svg"}
                        alt="star"
                    />
                ))}
            </div>
        );
    };

    return (
        <div id="reviews" className="info-tab active">

            <Helmet>
                <title>{t('info.reviews.meta-title')}</title>
                <meta name="description" content={t('info.reviews.meta-title')} />
            </Helmet>

            <h1 className="info-title">{t('info.reviews.title')}</h1>

            <div className="reviews-summary-block">
                <div className="rating-number">

                    <span className="rating-value">{storeRating ? storeRating.toFixed(1) : 0}</span>

                    <div className="stars-and-feedback">
                        {renderStars(Math.round(storeRating))}
                        <span className="review-count">{totalReviews} {t('info.reviews.count')}</span>
                    </div>
                </div>

                <button className="add-review-btn" onClick={handleAddFeedbackClick}>
                    <img src="/img/like.svg" alt="img-like" />
                    {t('info.reviews.add-btn')}
                </button>
            </div>

            <div className="product-reviews-list">
                {loading ? (
                    <p style={{ color: '#0E2CA4' }}>{t('info.reviews.loading')}</p>
                ) : reviews.length > 0 ? (
                    reviews.map((feedback) => (
                        <FeedbackCard key={feedback.id} feedback={feedback} />
                    ))
                ) : (
                    <p style={{ color: '#94A3B8', fontSize: '16px', margin: '0' }}>{t('info.reviews.empty')}</p>
                )}
            </div>

            {page < totalPages - 1 && (
                <div className="btn-else-feedback">
                    <button
                        className="else-feedback"
                        onClick={handleLoadMore}
                        disabled={loading}
                    >
                        {loading ? t('info.reviews.loading-btn') : t('info.reviews.load-more', { count: pageSize })}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewsTab;