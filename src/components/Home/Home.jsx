import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import HeroSlider from '../HeroSlider/HeroSlider';
import ProductSlider from '../ProductSlider/ProductSlider';
import Feedbacks from '../Feedbacks/Feedbacks';
import AuthModal from '../Modals/AuthenticationModal/AuthenticationModal';

import { productService } from '../../services/productService';
import {Helmet} from "react-helmet-async";
import {useTranslation} from "react-i18next";

const Home = () => {

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const [newProducts, setNewProducts] = useState([]);
    const [discountProducts, setDiscountProducts] = useState([]);
    const [bestsellers, setBestsellers] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [newData, discountData, bestData] = await Promise.all([
                    productService.getNew(),
                    productService.getDiscount(),
                    productService.getBestsellers()
                ]);

                setNewProducts(newData);
                setDiscountProducts(discountData);
                setBestsellers(bestData);
            } catch (error) {
                console.error(t('helmet.error'), error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [t]);

    if (isLoading) {
        return <div style={{textAlign: 'center', padding: '50px'}}>{t('ui.dowland')}</div>;
    }

    return (
        <main className="hero-section">

            <Helmet>
                <title>{t('seo.title')}</title>
                <meta name="description" content={t('seo.description')} />
                <link rel="canonical" href="https://moki.com.ua" />

                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://moki.com.ua" />
                <meta property="og:title" content={t('seo.og-title')} />
                <meta property="og:description" content={t('seo.og-description')} />
                <meta property="og:image" content="https://moki.com.ua/img/og-main.jpg" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={t('seo.twitter-title')} />
                <meta name="twitter:description" content={t('seo.twitter-description')} />
                <meta name="twitter:image" content="https://moki.com.ua/img/icon.png" />

                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "Moki Market",
                        "url": "https://moki.com.ua",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": "https://moki.com.ua/catalog?search={search_term_string}",
                            "query-input": "required name=search_term_string"
                        }
                    })}
                </script>
            </Helmet>

            <div className="container hero__grid">

                <h1 className="visually-hidden">{t('ui.title')}</h1>
                <AuthModal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                />

                <div className="main-section">
                    <Sidebar />
                    <HeroSlider />
                </div>

                {newProducts.length > 0 && (
                    <div className="new-goods">
                        <ProductSlider title={t('ui.new')} products={newProducts} />
                    </div>
                )}

                {discountProducts.length > 0 && (
                    <div className="discount-goods">
                        <ProductSlider title={t('ui.sales')} products={discountProducts} />
                    </div>
                )}

                {bestsellers.length > 0 && (
                    <div className="bestseller">
                        <ProductSlider title={t('ui.bestseller')} products={bestsellers} />
                    </div>
                )}

                <Feedbacks />

            </div>
        </main>
    );
};

export default Home;