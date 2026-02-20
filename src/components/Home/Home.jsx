import React, { useState, useEffect } from 'react';
import {useSearchParams} from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '../Sidebar/Sidebar';
import HeroSlider from '../HeroSlider/HeroSlider';
import ProductSlider from '../ProductSlider/ProductSlider';
import Feedbacks from '../Feedbacks/Feedbacks';
import AuthModal from '../Modals/AuthenticationModal/AuthenticationModal';

import { productService } from '../../services/productService';

const Home = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const [newProducts, setNewProducts] = useState([]);
    const [discountProducts, setDiscountProducts] = useState([]);
    const [bestsellers, setBestsellers] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const activationStatus = searchParams.get('activation');

        if (activationStatus === 'success') {

            toast.success('Акаунт активований!', {
                duration: 4000,
                style: {
                    width: '380px',
                }
            });

            setIsAuthModalOpen(true);

            searchParams.delete('activation');
            setSearchParams(searchParams, { replace: true });
        }

        if (activationStatus === 'error') {
            toast.error('Помилка активації.', {
                duration: 4000,
                style: {
                    width: '300px'
                }
            });
        }
    }, [searchParams, setSearchParams]);

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