import { useEffect, useState } from 'react';
import { feedbackService } from '../../../services/feedbackService';

const ReviewsTab = () => {
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

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('uk-UA');
    };

    return (
        <div id="reviews" className="info-tab active">
            <h2 className="info-title">Відгуки про магазин</h2>

            <div className="reviews-summary-block">
                <div className="rating-number">

                    <span className="rating-value">{storeRating ? storeRating.toFixed(1) : 0}</span>

                    <div className="stars-and-feedback">
                        {renderStars(Math.round(storeRating))}
                        <span className="review-count">{totalReviews} відгуків</span>
                    </div>
                </div>

                <button className="add-review-btn">
                    <img src="/img/like.svg" alt="img-like" />
                    Додайте відгук
                </button>
            </div>

            <div className="review-cards">
                {reviews.map((review) => (
                    <div className="review-card" key={review.id}>
                        <div className="review-user">
                            <div className="avatar-circle">
                                <img
                                    src={review.userImageUrl || "/img/white_user.svg"}
                                    alt={review.firstNameUser}
                                    style={{ objectFit: 'cover', width: '75%', height: '75%' }}
                                />
                            </div>
                            <div className="user-meta">
                                <span className="name">{review.firstNameUser}</span>
                                <div className="stars-and-date">
                                    <span className="date">{formatDate(review.createdAt)}</span>
                                    {renderStars(review.rating)}
                                </div>
                            </div>
                        </div>

                        <p className="review-text">{review.comment}</p>

                        {review.answer && (
                            <div className="admin-reply">
                                <div className="admin-header">
                                    <img src="/icon.png" alt="Moki" />
                                    <div className="name-and-date">
                                        <div className="name">Moki</div>
                                        <div className="date">{formatDate(review.answeredAt)}</div>
                                    </div>
                                </div>
                                <p className="review-text">{review.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {page < totalPages - 1 && (
                <div className="btn-else-feedback">
                    <button
                        className="else-feedback"
                        onClick={handleLoadMore}
                        disabled={loading}
                    >
                        {loading ? 'Завантаження...' : `Показати ще ${pageSize} коментарів`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewsTab;