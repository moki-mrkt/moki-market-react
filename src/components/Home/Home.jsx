import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import HeroSlider from '../HeroSlider/HeroSlider';
import ProductSlider from '../ProductSlider/ProductSlider';
import Feedbacks from '../Feedbacks/Feedbacks';

import { productService } from '../../services/productService';

const Home = () => {

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
            <div className="container hero__grid">

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