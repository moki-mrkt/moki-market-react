import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HeroSlider.css';

const HeroSlider = () => {

    const [prevEl, setPrevEl] = useState(null);
    const [nextEl, setNextEl] = useState(null);
    const [paginationEl, setPaginationEl] = useState(null);

    return (
        <section className="slider-area">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={28}
                slidesPerView={3}
                loop={true}
                className="banner-slider"

                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}

                navigation={{
                    prevEl: prevEl,
                    nextEl: nextEl,
                }}

                // === ПАГІНАЦІЯ (ТОЧКИ) ===
                pagination={{
                    el: paginationEl,
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
            >
                <SwiperSlide className="banner"><img src="/img/about_1.png" alt="ads" /></SwiperSlide>
                <SwiperSlide className="banner"><img src="/img/about_2.png" alt="ads" /></SwiperSlide>
                <SwiperSlide className="banner"><img src="/img/about_3.png" alt="ads" /></SwiperSlide>
                <SwiperSlide className="banner"><img src="/img/about_1.png" alt="ads" /></SwiperSlide>
                <SwiperSlide className="banner"><img src="/img/about_2.png" alt="ads" /></SwiperSlide>
                <SwiperSlide className="banner"><img src="/img/about_3.png" alt="ads" /></SwiperSlide>
            </Swiper>

            <button ref={(node) => setPrevEl(node)} className="slider-arrow arrow-prev">
                <img src="/img/left-arrow.svg" alt="Prev" />
            </button>

            <button ref={(node) => setNextEl(node)} className="slider-arrow arrow-next">
                <img src="/img/right-arrow.svg" alt="Next" />
            </button>

            <div ref={(node) => setPaginationEl(node)} className="slider-dots"></div>
        </section>
    );
};

export default HeroSlider;