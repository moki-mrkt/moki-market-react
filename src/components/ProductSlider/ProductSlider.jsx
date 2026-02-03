import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductCard from '../ProductCard/ProductCard';

import 'swiper/css';
import 'swiper/css/navigation';
import './ProductSlider.css'; // Стилі для заголовків і слайдера

const ProductSlider = ({ title, products }) => {

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <div className="product-slider-section">

            {/* Заголовок і кнопки тепер в одному контейнері, щоб легше позиціонувати */}
            <div className="slider-header">
                <h2 className="main-title">{title}</h2>

                {/* Кнопки навігації */}
                <div className="slider-buttons">
                    <button ref={prevRef} className="slider-arrow arrow-prev">
                        <img src="/img/left-arrow.svg" alt="Prev" />
                    </button>
                    <button ref={nextRef} className="slider-arrow arrow-next">
                        <img src="/img/right-arrow.svg" alt="Next" />
                    </button>
                </div>
            </div>

            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={5}
                navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                }}

                breakpoints={{
                    320: { slidesPerView: 1.8, spaceBetween: 10, centeredSlides: false },
                    380: { slidesPerView: 2.2, spaceBetween: 10, centeredSlides: false },
                    480: { slidesPerView: 2.2, spaceBetween: 10 },
                    640: { slidesPerView: 2.5, spaceBetween: 15 },
                    900: { slidesPerView: 3, spaceBetween: 20 },
                    1200: { slidesPerView: 4, spaceBetween: 20 },
                    1400: { slidesPerView: 5, spaceBetween: 20 }
                }}
                className="goods-block"
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id}>
                        {/* Це автоматично передасть id, name, price, images і т.д. як пропси */}
                        <ProductCard {...product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ProductSlider;