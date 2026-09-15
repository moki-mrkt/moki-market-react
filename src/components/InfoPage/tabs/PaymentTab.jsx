import {Helmet} from "react-helmet-async";
import React from "react";
import { useTranslation } from 'react-i18next';

const PaymentTab = () => {
    const { t } = useTranslation();

    return (
        <div id="payment" className="info-tab active">
            <Helmet>
                <title>{t('info.payment.meta-title')}</title>
                <meta name="description" content={t('info.payment.meta-title')} />
            </Helmet>
            <h1 className="info-title">{t('info.payment.title')}</h1>
            <div className="info-cards-container">
                <div className="info-card">
                    <h2 className="info-card-title">{t('info.payment.sub-1')}</h2>
                    <p className="info-card-subtitle">{t('info.payment.p-1')}</p>
                    <div className="delivery-logos">
                        <div className="logo-item">
                            <img src="/img/nova_poshta.png" alt="Nova Poshta" className="delivery-img" />
                        </div>
                        <div className="logo-item ukr_poshta-group">
                            <img src="/img/ukr_poshta.png" alt="Ukr_poshta" className="delivery-img" />
                            <div className="logo-note">{t('info.payment.note')}</div>
                        </div>
                    </div>
                    <ul className="info-list">
                        <li>{t('info.payment.li-1')}</li>
                        <li>{t('info.payment.li-2')}</li>
                        <li>{t('info.payment.li-3')}</li>
                    </ul>
                    <h3 className="info-card-subtitle">{t('info.payment.sub-2')}</h3>
                    <p className="info-card-text">{t('info.payment.p-2')}</p>
                    <p className="info-card-text">{t('info.payment.p-3')}</p>
                </div>

                <div className="info-card">
                    <h2 className="info-card-title">{t('info.payment.sub-3')}</h2>
                    <p className="info-card-text margin-bottom-small">{t('info.payment.p-4')}</p>
                    <p className="info-card-text">
                        {t('info.payment.p-5-1')}<br />
                        {t('info.payment.p-5-2')}<br />
                        {t('info.payment.p-5-3')}<br />
                        {t('info.payment.p-5-4')}
                    </p>
                    <p className="info-card-text margin-top-medium">
                        {t('info.payment.p-6')}
                    </p>
                    <p className="info-card-text">
                        {t('info.payment.p-7')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentTab;