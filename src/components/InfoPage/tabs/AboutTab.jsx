import {Helmet} from "react-helmet-async";
import React from "react";
import { useTranslation } from 'react-i18next';

const AboutTab = () => {
    const { t } = useTranslation();

    return (
        <div id="about" className="info-tab active">
            <Helmet>
                <title>{t('info.about.meta-title')}</title>
                <meta name="description" content={t('info.about.meta-desc')} />
            </Helmet>

            <h1 className="info-title">{t('info.about.title')}</h1>
            <div className="text-block">
                <p>{t('info.about.p-1')}</p>
                <p>{t('info.about.p-2')}</p>
            </div>

            <h2 className="section-subtitle">{t('info.about.sub')}</h2>
            <div className="advantages-grid">
                <div className="adv-card card-1">
                    <div className="adv-icon"><img src="/img/leaf.svg" alt="Quality" /></div>
                    <p>{t('info.about.adv-1')}</p>
                </div>
                <div className="adv-card card-2">
                    <div className="adv-icon"><img src="/img/truck.svg" alt="Delivery" /></div>
                    <p>{t('info.about.adv-2')}</p>
                </div>
                <div className="adv-card card-1">
                    <div className="adv-icon"><img src="/img/check.svg" alt="Update" /></div>
                    <p>{t('info.about.adv-3')}</p>
                </div>
                <div className="adv-card card-2">
                    <div className="adv-icon"><img src="/img/headset.svg" alt="Support" /></div>
                    <p>{t('info.about.adv-4')}</p>
                </div>
            </div>

            <div className="text-block">
                <p><strong>{t('info.about.p-3-1')}</strong> {t('info.about.p-3-2')}</p>
                <p><strong>{t('info.about.p-4-1')}</strong> {t('info.about.p-4-2')}</p>
            </div>

            <div className="about-gallery">
                <div className="gallery-item"><img src="/img/about_1.png" alt="Dates" /></div>
                <div className="gallery-item"><img src="/img/about_2.png" alt="Mix" /></div>
                <div className="gallery-item"><img src="/img/about_3.png" alt="Nuts" /></div>
            </div>
        </div>
    );
};

export default AboutTab;