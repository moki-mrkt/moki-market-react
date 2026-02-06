// src/components/UserRoom/tabs/UserReviews.jsx
import React from 'react';

const UserReviews = () => {
    return (
        <div className="reviews-header">
            <h2 className="content-title">Відгуки</h2>

            <form className="review-form">
                <div className="rating-row">
                    <span className="rating-label">Оцініть магазин</span>
                    <div className="stars-interactive">
                        {[...Array(5)].map((_, index) => (
                            <img key={index} src="/img/star-outline.svg" alt="star" className="star-icon" style={{cursor: 'pointer'}} />
                        ))}
                    </div>
                </div>

                <div className="full-width">
                    <textarea id="review-msg" className="account-input review-textarea" placeholder="Повідомлення"></textarea>
                </div>

                <button type="submit" className="save-btn">Надіслати</button>
            </form>
        </div>
    );
};

export default UserReviews;