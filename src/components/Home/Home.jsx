import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import HeroSlider from '../HeroSlider/HeroSlider';
import ProductSlider from '../ProductSlider/ProductSlider';
import Feedbacks from '../Feedbacks/Feedbacks';
import AuthModal from '../Modals/AuthenticationModal/AuthenticationModal';

import { productService } from '../../services/productService';
import {Helmet} from "react-helmet-async";

const Home = () => {

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const [newProducts, setNewProducts] = useState([]);
    const [discountProducts, setDiscountProducts] = useState([]);
    const [bestsellers, setBestsellers] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

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
            console.error("Помилка завантаження даних:", error);
        } finally {
            setIsLoading(false);
        }
    };

        fetchData();
    }, []);

    if (isLoading) {
        return <div style={{textAlign: 'center', padding: '50px'}}>Завантаження...</div>;
    }

    return (
        <main className="hero-section">

            <Helmet>
                <title>Moki | Горіхи, сухофрукти та корисні ласощі</title>
                <meta name="description" content="Інтернет-магазин Moki: найкращий вибір горіхів, сухофруктів, кави та солодощів з доставкою по всій Україні." />
                <link rel="canonical" href="https://moki.com.ua" />

                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://moki.com.ua" />
                <meta property="og:title" content="Moki — корисні солодощі та добірні горіхи" />
                <meta property="og:description" content="Шукаєте корисний перекус? У Moki ви знайдете найсвіжіші горіхи та сухофрукти." />
                <meta property="og:image" content="https://moki.com.ua/img/og-main.jpg" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Moki | Горіхи та сухофрукти" />
                <meta name="twitter:description" content="Найкращий вибір горіхів та солодощів з доставкою." />
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

                <h1 className="visually-hidden">Moki — горіхи, сухофрукти та корисні ласощі</h1>
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
                        <ProductSlider title="Новинки" products={newProducts} />
                    </div>
                )}

                {discountProducts.length > 0 && (
                    <div className="discount-goods">
                        <ProductSlider title="Акційні пропозиції" products={discountProducts} />
                    </div>
                )}

                {bestsellers.length > 0 && (
                    <div className="bestseller">
                        <ProductSlider title="Хіт продажів" products={bestsellers} />
                    </div>
                )}

                <Feedbacks />

            </div>
        </main>
    );
};

export default Home;