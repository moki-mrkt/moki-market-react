import {Helmet} from "react-helmet-async";
import React from "react";
import { useTranslation } from 'react-i18next';

const ContactsTab = () => {
    const { t } = useTranslation();

    return (
        <div id="contacts" className="info-tab active">
            <Helmet>
                <title>{t('info.contacts.meta-title')}</title>
                <meta name="description" content={t('info.contacts.meta-desc')} />
            </Helmet>
            <h1 className="info-title">{t('info.contacts.title')}</h1>
            <div className="contacts-details">
                <div className="contact-group-item">
                    <h3 className="contact-label-title">{t('info.contacts.label-contacts')}</h3>
                    <a href="tel:+380000000000" className="contact-link-text">+ 380 (99) 819 97 96</a>
                    <a href="tel:+380000000000" className="contact-link-text">+ 380 (50) 168 96 68</a>
                </div>
                <div className="contact-group-item">
                    <h3 className="contact-label-title">{t('info.contacts.label-email')}</h3>
                    <a href="mailto:moki@gmail.com" className="contact-link-text">moki.mrkt@gmail.com</a>
                </div>
                <div className="contact-group-item">
                    <h3 className="contact-label-title">{t('info.contacts.label-schedule')}</h3>
                    <p className="contact-text-value">{t('info.contacts.schedule-val')}</p>
                </div>
                <div className="contact-group-item">
                    <h3 className="contact-label-title">{t('info.contacts.label-address')}</h3>
                    <p className="contact-text-value">{t('info.contacts.address-val')}</p>
                </div>
            </div>
        </div>
    );
};

export default ContactsTab;