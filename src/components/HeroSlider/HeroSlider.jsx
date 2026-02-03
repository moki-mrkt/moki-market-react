import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Стилі
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HeroSlider.css';

const HeroSlider = () => {
    // Створюємо рефи для кнопок та пагінації
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const paginationRef = useRef(null);

    return (
        <section className="slider-area">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={28}
                slidesPerView={3}
                loop={true}
                className="banner-slider"

                // === АВТОПЛЕЙ ===
                autoplay={{
                    delay: 3000, // Ваші 10 секунд з JS
                    disableOnInteraction: false,
                }}

                // === НАВІГАЦІЯ ===
                // Прив'язуємо до наших кнопок через ref
                navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}

                // === ПАГІНАЦІЯ (ТОЧКИ) ===
                pagination={{
                    el: paginationRef.current,
                    clickable: true,
                    bulletClass: 'dot',
                    bulletActiveClass: 'active',
                    renderBullet: function (index, className) {
                        return '<span class="' + className + '"></span>';
                    },
                }}

                breakpoints={{
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 10
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 28
                    }
                }}

                // Важливо: ініціалізація елементів управління
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                    swiper.params.pagination.el = paginationRef.current;
                }}
            >
                {/* Слайди */}
                <SwiperSlide className="banner"><img src="/img/ads_1.png" alt="ads" /></SwiperSlide>
                <SwiperSlide className="banner"><img src="/img/ads_2.png" alt="ads" /></SwiperSlide>
                <SwiperSlide className="banner"><img src="/img/ads_3.png" alt="ads" /></SwiperSlide>
                <SwiperSlide className="banner"><img src="/img/ads_1.png" alt="ads" /></SwiperSlide>
            </Swiper>

            {/* === ЕЛЕМЕНТИ УПРАВЛІННЯ === */}
            {/* Вони мають бути зовні Swiper, але всередині секції */}

            <button ref={prevRef} className="slider-arrow arrow-prev">
                <img src="/img/left-arrow.svg" alt="Prev" />
            </button>

            <button ref={nextRef} className="slider-arrow arrow-next">
                <img src="/img/right-arrow.svg" alt="Next" />
            </button>

            {/* Контейнер для точок */}
            <div ref={paginationRef} className="slider-dots"></div>
        </section>
    );
};

export default HeroSlider;