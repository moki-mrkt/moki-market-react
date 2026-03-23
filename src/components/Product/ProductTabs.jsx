import React, {useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { authService } from '../../services/authService';
import { feedbackService } from '../../services/feedbackService';
import  '../Feedbacks/Feedbacks.css';
import  './ProductTabs.css';
import DeleteFeedbackModal from "../Modals/DeleteFeedbackModal/DeleteFeedbackModal.jsx";
import FeedbackCard from "../FeedbackCard/FeedbackCard.jsx";

const ProductTabs = ({ description, characteristics, productId }) => {
    const [activeTab, setActiveTab] = useState('description');

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const [feedbacks, setFeedbacks] = useState([]);
    const [isLoadingFeedbacks, setIsLoadingFeedbacks] = useState(false);

    const [userFeedback, setUserFeedback] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 4;

    const isAuth = authService.isAuthenticated();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tabFromUrl = searchParams.get('tab');

        if (tabFromUrl === 'reviews' || tabFromUrl === 'characteristics' || tabFromUrl === 'description') {
            setActiveTab(tabFromUrl);

            const tabsElement = document.querySelector('.product-tabs');
            if (tabsElement) {
                tabsElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [location.search]);

    useEffect(() => {
        if (activeTab === 'reviews' && productId) {
            loadFeedbacks();
        }
    }, [activeTab, productId, page]);

    const loadFeedbacks = async () => {
        setIsLoadingFeedbacks(true);
        try {
            const data = await feedbackService.getProductFeedbacks(productId, page, pageSize);
            setFeedbacks(data.content || data || []);
            setTotalPages(data.page?.totalPages || data.totalPages || 0);
        } catch (error) {
            console.error("Не вдалося завантажити відгуки", error);
        } finally {
            setIsLoadingFeedbacks(false);
        }
    };

    useEffect(() => {
        const fetchMyFeedback = async () => {
            if (isAuth && productId) {
                try {
                    const data = await feedbackService.getUserFeedbackAboutProduct(productId);
                    if (data) {
                        setUserFeedback(data);
                    }
                } catch (error) {

                }
            }
        };
        fetchMyFeedback();
    }, [isAuth, productId]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) { toast.error("Будь ласка, оберіть оцінку"); return; }
        if (!comment.trim()) { toast.error("Будь ласка, напишіть текст"); return; }
        if (comment.length < 2 || comment.length > 1000) { toast.error("Текст повинен бути більше 2 або меньше 1000 символів"); return; }

        setIsSubmitting(true);

        try {
            if (isEditing && userFeedback) {
                const updatedFeedback = await feedbackService.update(userFeedback.id, { rating, comment });
                setUserFeedback(updatedFeedback || { ...userFeedback, rating, comment });
                setIsEditing(false);
                toast.success("Ваш відгук успішно оновлено!");
            } else {
                const newFeedback = await feedbackService.createFeedback({ rating, comment, productId });
                setUserFeedback(newFeedback);
                toast.success("Ваш відгук успішно додано!");
            }
            setRating(0);
            setComment('');
            loadFeedbacks();
        } catch (error) {
            toast.error("Помилка при збереженні відгуку.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setRating(userFeedback.rating);
        setComment(userFeedback.comment);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setRating(0);
        setComment('');
    };

    const handleLoginClick = () => {
        navigate(`${location.pathname}?tab=reviews&login=true`);
    };

    const handleDeleteClick = (e) => {
        e.preventDefault();
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteFeedback = async () => {
        try {
            await feedbackService.delete(userFeedback.id);

            setUserFeedback(null);
            setIsEditing(false);
            toast.success("Ваш відгук успішно видалено");
            loadFeedbacks();
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error("Не вдалося видалити відгук. Спробуйте пізніше.");
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div className="product-tabs">

            <DeleteFeedbackModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteFeedback}
            />

            <div className="tabs-header">
                <button
                    className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                    onClick={() => setActiveTab('description')}
                >
                    Опис
                </button>
                <button
                    className={`tab-btn ${activeTab === 'characteristics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('characteristics')}
                >
                    Характеристики
                </button>
                <button
                    className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Відгуки
                </button>
            </div>

            <div className="tab-content">

                <button
                    className={`mobile-accordion-btn ${activeTab === 'description' ? 'active' : ''}`}
                    onClick={() => setActiveTab(activeTab === 'description' ? '' : 'description')}
                >
                    <span>Опис</span>
                </button>

                {activeTab === 'description' && (
                    <div className="tab-pane active">
                        <p className="tab-text">{description}</p>
                    </div>
                )}

                <button
                    className={`mobile-accordion-btn ${activeTab === 'characteristics' ? 'active' : ''}`}
                    onClick={() => setActiveTab(activeTab === 'characteristics' ? '' : 'characteristics')}
                >
                    <span>Характеристики</span>
                </button>

                {activeTab === 'characteristics' && (
                    <div className="tab-pane active">
                        <div className="tab-text">
                            {characteristics && Object.keys(characteristics).length > 0 ? (
                                <table className="char-list">
                                    <tbody>
                                    {Object.entries(characteristics).map(([key, value]) => (
                                        <tr key={key} >
                                            <th className="char-key">{key}: </th>
                                            <td className="char-value">{value}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="no-data-text">Характеристики відсутні.</p>
                            )}
                        </div>
                    </div>
                )}

                <button
                    className={`mobile-accordion-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab(activeTab === 'reviews' ? '' : 'reviews')}
                >
                    <span>Відгуки</span>
                </button>

                {activeTab === 'reviews' && (
                    <div className="tab-pane reviews-pane active">

                        <div className="review-form-container">

                            <div className="product-reviews-list">
                                {isLoadingFeedbacks ? (
                                    <p style={{ color: '#0E2CA4' }}>Завантаження відгуків...</p>
                                ) : feedbacks.length > 0 ? (
                                    feedbacks.map((feedback) => <FeedbackCard key={feedback.id} feedback={feedback} />)
                                ) : (
                                    <p style={{ color: '#94A3B8', fontSize: '16px', margin: '0' }}>Відгуків про цей товар ще немає. Будьте першим!</p>
                                )}
                            </div>

                            {totalPages > 1 && (
                                <div className="pag-block">
                                    <button
                                        onClick={() => setPage(p => p - 1)}
                                        className="pag-button"
                                        disabled={page === 0}
                                        style={{
                                            opacity: page > 0 ? 1 : 0.4,
                                            cursor:  page > 0 ? 'pointer' : 'default'
                                        }}
                                    >
                                        Попередня
                                    </button>

                                    <span className="pag-text">
                                        Сторінка {page + 1} з {totalPages}
                                    </span>

                                    <button
                                        onClick={() => setPage(p => p + 1)}
                                        className="pag-button"
                                        disabled={page >= totalPages - 1}
                                        style={{
                                            opacity:  page < totalPages - 1 ? 1 : 0.4,
                                            cursor:  page < totalPages - 1 ? 'pointer' : 'default'
                                        }}
                                    >
                                        Наступна
                                    </button>
                                </div>
                            )}

                            <hr className="feedback-separator"/>

                            {!isAuth ? (
                                <div className="feedback-warning">
                                    <p className="feedback-warning-text">
                                        *Тільки авторизовані користувачі можуть залишати відгуки про товар.
                                    </p>
                                    <button className="feedback-btn-login" onClick={handleLoginClick}>
                                        Увійти в кабінет
                                    </button>
                                </div>
                            ) : userFeedback && !isEditing ? (
                                <div>
                                   <h4 className="feedback-header-text" >Ваш відгук:</h4>

                                    <div className="header-send-feedback">
                                        <h4 className="rate-text" >Оцінка:</h4>
                                        <div className="my-feedback-stars" >
                                            {[...Array(5)].map((_, index) => (
                                                <img key={index}
                                                     src={index < userFeedback.rating ? "/img/star.svg" : "/img/star-outline.svg"}
                                                     alt="star"
                                                     style={{ width: '20px', height: '20px'}}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="existing-feedback-block">
                                        <p className="exists-feedback-text" >{userFeedback.comment}</p>
                                    </div>

                                    <div className="product-feedback-btn-block">
                                        <button onClick={handleEditClick} className="feedback-send-btn feedback-blue-btn">
                                            Редагувати
                                        </button>
                                        <button onClick={handleDeleteClick}
                                                className="feedback-send-btn feedback-red-btn">
                                            Видалити
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleReviewSubmit} className="form-send-feedback">

                                    <p className="feedback-header-text">
                                        {isEditing ? "Редагування відгуку:" : "Залиште відгук про цей товар:"}
                                    </p>

                                    <div className="header-send-feedback" >
                                        <span className="rate-text">Оцінка:</span>
                                        <div className="my-feedback-stars">
                                            {[...Array(5)].map((_, index) => {
                                                const starValue = index + 1;
                                                return (
                                                    <img
                                                        key={index}
                                                        src={starValue <= (hoverRating || rating) ? "/img/star.svg" : "/img/star-outline.svg"}
                                                        alt="star"
                                                        style={{ width: '20px', height: '20px', cursor: 'pointer', transition: 'transform 0.2s' }}
                                                        onMouseEnter={() => setHoverRating(starValue)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        onClick={() => setRating(starValue)}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <textarea
                                        placeholder="Напишіть ваші враження про цей товар..."
                                        className="product-textarea"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        disabled={isSubmitting}
                                        onFocus={(e) => e.target.style.borderColor = '#0E2CA4'}
                                        onBlur={(e) => e.target.style.borderColor = '#AEBED2'}
                                    />

                                    <div className="product-feedback-btn-block">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="feedback-send-btn feedback-blue-btn">
                                            {isSubmitting ? 'Збереження...' : (isEditing ? 'Оновити' : 'Надіслати')}
                                        </button>

                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={handleCancelEdit}
                                                className="feedback-send-btn feedback-red-btn"
                                            >
                                                Скасувати
                                            </button>
                                        )}
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductTabs;