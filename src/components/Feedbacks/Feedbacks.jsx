import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Feedbacks.css';

import { feedbackService } from '../../services/feedbackService'; // Імпорт сервісу

const Feedbacks = () => {

    const [feedbacks, setFeedbacks] = useState([]);
    const [storeRating, setStoreRating] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            setIsLoading(true);
            const data = await feedbackService.getStoreFeedbacks(0, 4);

            if (data && data.feedbacks) {
                // Зверніть увагу: масив лежить у data.feedbacks.content
                setFeedbacks(data.feedbacks.content);
                // Загальний рейтинг магазину
                setStoreRating(data.storeRating);
            }
            setIsLoading(false);
        };

        fetchFeedbacks();
    }, []);

    const formatDate = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (isLoading) {
        return null;
    }

    if (feedbacks.length === 0) {
        return null;
    }

    return (
        <section className="feedbacks-section">
            <h2 className="main-title">
                Відгуки про магазин
            </h2>

            <div className="feedbacks-grid">
                {feedbacks.map((item) => (
                    <div className="feedback-card" key={item.id}>
                        <div className="feedback-header">
                            {/* Ім'я користувача або Анонім */}
                            <span className="feedback-name">{item.firstNameUser || 'Користувач'}</span>
                            <div className="feedback-stars">
                                {[...Array(5)].map((_, index) => (
                                    <img
                                        key={index}
                                        src={index < item.rating ? "/img/star.svg" : "/img/star-outline.svg"}
                                        alt="star"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="feedback-date">{formatDate(item.createdAt)}</div>

                        <p className="feedback-text">{item.comment}</p>
                    </div>
                ))}
            </div>

            <div className="feedbacks-actions">
                <Link to="/info/reviews" className="btn-all-feedbacks">Усі відгуки</Link>
            </div>
        </section>
    );
};

export default Feedbacks;