import {Helmet} from "react-helmet-async";
import React from "react";
import { useTranslation } from 'react-i18next';

const TermsTab = () => {
    const { t } = useTranslation();

    return (
        <div id="terms" className="info-tab active">
            <Helmet>
                <title>{t('info.terms.meta-title')}</title>
                <meta name="description" content={t('info.terms.meta-desc')} />
                <meta name="robots" content="noindex, follow" />
            </Helmet>
            <h1 className="info-title">{t('info.terms.title')}</h1>
            <div className="info-card term-text">
                <p className="term-p">{t('info.terms.intro-1')} <strong>{t('info.terms.intro-2')}</strong> {t('info.terms.intro-3')} <strong>{t('info.terms.intro-4')}</strong>{t('info.terms.intro-5')}</p>

                <section>
                    <h2 className="term-header">{t('info.terms.h1')}</h2>
                    <ul className="term-list" >
                        <li><strong>{t('info.terms.l1-1-1')}</strong> {t('info.terms.l1-1-2')}</li>
                        <li><strong>{t('info.terms.l1-2-1')}</strong> {t('info.terms.l1-2-2')}</li>
                        <li><strong>{t('info.terms.l1-3-1')}</strong> {t('info.terms.l1-3-2')}</li>
                        <li><strong>{t('info.terms.l1-4-1')}</strong> {t('info.terms.l1-4-2')}</li>
                    </ul>
                </section>

                <section>
                    <h2 className="term-header">{t('info.terms.h2')}</h2>
                    <p className="term-p">{t('info.terms.p2-1')}</p>
                    <p className="term-p">{t('info.terms.p2-2')}</p>
                </section>

                <section>
                    <h2 className="term-header">{t('info.terms.h3')}</h2>
                    <p className="term-p">{t('info.terms.p3-1')}</p>
                    <p className="term-p">{t('info.terms.p3-2')}</p>
                </section>

                <section>
                    <h2 className="term-header">{t('info.terms.h4')}</h2>
                    <p className="term-p">{t('info.terms.p4-1')}</p>
                    <p className="term-p">{t('info.terms.p4-2')}</p>
                    <p className="term-p">{t('info.terms.p4-3')}</p>
                </section>

                <section>
                    <h2 className="term-header">{t('info.terms.h5')}</h2>
                    <p className="term-p">{t('info.terms.p5-1-1')} <strong>{t('info.terms.p5-1-2')}</strong> {t('info.terms.p5-1-3')}</p>
                    <p className="term-p">{t('info.terms.p5-2')}</p>
                </section>

                <section>
                    <h2 className="term-header">{t('info.terms.h6')}</h2>
                    <p className="term-p">{t('info.terms.p6-1')}</p>
                </section>
            </div>
        </div>
    );
};

export default TermsTab;