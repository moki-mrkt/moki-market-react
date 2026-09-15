import React from 'react';
import './NotFoundPage.css';
import {useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {

    const navigate = useNavigate();
    const { t } = useTranslation();

    const onClose = () => {
        navigate('/');
    };

    return (
        <div className="not-found-modal-content">

            <Helmet>
                <title>{t('not-found.title')}</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <h2>{t('not-found.heading')}</h2>
            <p>
                {t('not-found.text')}
            </p>

            <div className="not-found-modal-info">
                <img className="not-found-monkey-img" src="/img/sad_monkey.png" alt="monkey"/>

                <img className="not-found-arm-monkey-img" src="/img/arm_monkey.png" alt="arm-monkey"/>

                <button className="not-found-modal-btn" onClick={onClose}>
                    {t('not-found.home')}
                </button>
            </div>

        </div>
    );
};

export default NotFoundPage;