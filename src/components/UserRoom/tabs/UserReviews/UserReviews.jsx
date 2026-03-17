import React, {useEffect, useState} from 'react';
import toast from 'react-hot-toast';

import { feedbackService } from '../../../../services/feedbackService';

import DeleteFeedbackModal from '../../../../components/Modals/DeleteFeedbackModal/DeleteFeedbackModal';

import './UserReviews.css';

const UserReviews = () => {

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [existingFeedback, setExistingFeedback] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        const fetchMyFeedback = async () => {
            try {
                const data = await feedbackService.getUserFeedbackAboutStore();
                if (data) {
                    setExistingFeedback(data);
                    setRating(data.rating);
                    setComment(data.comment);
                }
            } catch (error) {
                // Якщо помилка 404 (Не знайдено) - це означає, що відгуку ще немає, це нормально
                console.log("Відгук про магазин ще не створено");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyFeedback();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error("Будь ласка, оберіть оцінку від 1 до 5");
            return;
        }

        if (!comment.trim()) {
            toast.error("Будь ласка, напишіть текст відгуку");
            return;
        }

        setIsSubmitting(true);

        try {
            if (isEditing && existingFeedback) {
                const updatedFeedback = await feedbackService.update(existingFeedback.id, { rating, comment });
                setExistingFeedback(updatedFeedback);
                setIsEditing(false);
                toast.success("Ваш відгук успішно оновлено!");
            } else {
                const newFeedback = await feedbackService.createFeedback({ rating, comment });
                setExistingFeedback(newFeedback);
                toast.success("Ваш відгук про магазин успішно додано!");
            }
        } catch (error) {
            console.error("Помилка відправки відгуку:", error);
            if (error.response && (error.response.status === 400 || error.response.status === 409)) {
                toast.error("Ви вже залишали відгук про наш магазин.");
            } else {
                toast.error("Помилка при додаванні відгуку. Спробуйте пізніше.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (e) => {
        e.preventDefault();
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteFeedback = async () => {
        try {
            await feedbackService.delete(existingFeedback.id);

            setExistingFeedback(null);
            setRating(0);
            setComment('');
            setIsDeleteModalOpen(false);

            toast.success("Ваш відгук успішно видалено");
        } catch (error) {
            console.error("Помилка видалення відгуку:", error);
            toast.error("Не вдалося видалити відгук. Спробуйте пізніше.");
            setIsDeleteModalOpen(false); // Все одно закриваємо модалку при помилці
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setRating(existingFeedback.rating);
        setComment(existingFeedback.comment);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setRating(existingFeedback.rating);
        setComment(existingFeedback.comment);
    };

    return (
        <div className="reviews-header">

            <DeleteFeedbackModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteFeedback}
            />

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '50px 0', color: '#0E2CA4' }}>
                    <h3>Завантаження...</h3>
                </div>
            ) : (
                <div className="review-form-container">
                    {existingFeedback && !isEditing ? (
                        <div className="review-form">
                            <h2 className="content-title">Ваш відгук про магазин</h2>

                            <div className="rating-row" >
                                <span className="rating-label">Оцінка:</span>
                                <div className="stars-interactive">
                                    {[...Array(5)].map((_, index) => (
                                        <img
                                            key={index}
                                            src={index < existingFeedback.rating ? "/img/star.svg" : "/img/star-outline.svg"}
                                            alt="star"
                                            className="star-icon"
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="review-textarea">

                                <p className="exists-reviews-text">
                                    {existingFeedback.comment}
                                </p>
                            </div>
                            <div className="exist-feedback-btn-block">
                                <button
                                    onClick={handleEditClick}
                                    className="save-btn"
                                >
                                    Редагувати
                                </button>

                                <button
                                    onClick={handleDeleteClick}
                                    className="save-btn delete-feedback-btn"
                                    style={{
                                        backgroundColor: '#EF4444',
                                        color: '#fff',
                                        border: '1px solid #EF4444'
                                    }}
                                >
                                    Видалити
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form className="review-form" onSubmit={handleSubmit}>
                            <h2 className="content-title">
                                {isEditing ? "Редагування відгуку" : "Відгук про магазин"}
                            </h2>

                            {!isEditing && (
                                <p className="reviews-text">
                                    У вас ще немає відгука про наш магазин. Приділіть будь ласка декілька хвилин та опишіть ваші враження про нас!
                                </p>
                            )}

                            <div className="rating-row">
                                <span className="rating-label">Оцінка: </span>
                                <div className="stars-interactive">
                                    {[...Array(5)].map((_, index) => {
                                        const starValue = index + 1;
                                        return (
                                            <img
                                                key={index}
                                                src={starValue <= (hoverRating || rating) ? "/img/star.svg" : "/img/star-outline.svg"}
                                                alt="star"
                                                className="star-icon"
                                                style={{ cursor: 'pointer', transition: '0.2s' }}
                                                onMouseEnter={() => setHoverRating(starValue)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setRating(starValue)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <textarea
                                    id="review-textarea"
                                    className="review-textarea"
                                    placeholder="Повідомлення"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    disabled={isSubmitting}
                                ></textarea>
                            </div>

                            <div className="feedback-btn-block">
                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={isSubmitting}
                                    style={{ opacity: isSubmitting ? 0.7 : 1 }}
                                >
                                    {isSubmitting ? 'Збереження...' : (isEditing ? 'Оновити' : 'Надіслати')}
                                </button>

                                {isEditing && (
                                    <button
                                        type="button"
                                        className="save-btn"
                                        onClick={handleCancelEdit}
                                        style={{ backgroundColor: 'transparent', color: '#EF4444', border: '1px solid #EF4444' }}
                                        disabled={isSubmitting}
                                    >
                                        Скасувати
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            )}

            <form className="review-form" >
                <h2 className="content-title">Ваші відгуки про продукти</h2>
                <p className="reviews-text">Тут будуть відображатися ваші відгуки про товари.</p>
            </form>
        </div>
    );
};

export default UserReviews;