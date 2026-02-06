import React from 'react';
import './NotFoundPage.css';
import {useNavigate} from "react-router-dom";

const NotFoundPage = () => {

    const navigate = useNavigate();
    const onClose = () => {
        navigate('/');
    };

    return (
            <div className="not-found-modal-content">

                <h2>Упс... Щось пішло не так</h2>
                <p>
                    Сторінка не знайдена
                </p>

                <div className="not-found-modal-info">
                    <img className="not-found-monkey-img" src="/img/sad_monkey.png" alt="monkey"/>

                    <img className="not-found-arm-monkey-img" src="/img/arm_monkey.png" alt="arm-monkey"/>

                    <button className="not-found-modal-btn" onClick={onClose}>
                        На головну
                    </button>
                </div>

            </div>
    );
};

export default NotFoundPage;