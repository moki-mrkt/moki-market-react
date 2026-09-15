import {Helmet} from "react-helmet-async";
import React from "react";
import { useTranslation } from 'react-i18next';

const ReturnTab = () => {
    const { t } = useTranslation();

    return (
        <div id="return" className="info-tab active">
            <Helmet>
                <title>{t('info.returns.meta-title')}</title>
                <meta name="description" content={t('info.returns.meta-title')} />
            </Helmet>
            <h1 className="info-title">{t('info.returns.title')}</h1>
            <div className="info-card">
                <h2 className="info-card-subtitle">{t('info.returns.sub-1')}</h2>
                <p className="info-card-text">{t('info.returns.p-1')}</p>
                <p className="info-card-text">{t('info.returns.p-2')}</p>

                <div>
                    <h3 className="info-card-subtitle">{t('info.returns.sub-2')}</h3>
                    <ul className="info-list">
                        <li>{t('info.returns.li-1-1')} <strong>{t('info.returns.li-1-2')}</strong>{t('info.returns.li-1-3')}</li>
                        <li>{t('info.returns.li-2-1')} <strong>{t('info.returns.li-2-2')}</strong> {t('info.returns.li-2-3')}</li>
                    </ul>
                </div>

                <h3 className="info-card-subtitle">{t('info.returns.sub-3')}</h3>
                <p className="info-card-text">{t('info.returns.p-3')}</p>
                <ol className="info-list">
                    <li>{t('info.returns.li-3-1')}</li>
                    <li>{t('info.returns.li-3-2-1')} <strong>{t('info.returns.li-3-2-2')}</strong> {t('info.returns.li-3-2-3')} <strong>{t('info.returns.li-3-2-4')}</strong>.</li>
                    <li>{t('info.returns.li-3-3')} <a href="tel:+380950460363" className="phone-link">(099) 819 97 96</a>.</li>
                </ol>

                <h3 className="info-card-subtitle">{t('info.returns.sub-4')}</h3>
                <p className="info-card-text">{t('info.returns.p-4-1')} <strong>{t('info.returns.p-4-2')}</strong>.</p>
            </div>
        </div>
    );
};

export default ReturnTab;