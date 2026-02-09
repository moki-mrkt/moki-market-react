import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Thumbs } from 'swiper/modules';

import './Product.css';

import {URLS} from '../../constants/urls';

const image_api =  URLS.s3_bucket;

const ProductGallery = ({ images, fallbackImage }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const displayImages = images && images.length > 0 ? images : [{ url: fallbackImage }];

    return (
        <>
            {/* Головний слайдер */}
            <Swiper
                spaceBetween={10}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[FreeMode, Thumbs]}
                className="main-slider"
            >
                {displayImages.map((img, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={`${image_api}${img.imageId || img}`}
                            alt={`Product view ${index + 1}`}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Слайдер мініатюр (Thumbs) */}
            {displayImages.length > 1 && (
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={0}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Thumbs]}
                    breakpoints={{
                        768: {
                            direction: 'vertical',
                            spaceBetween: 15,
                        }
                    }}
                    className="thumbs-slider"
                >
                    {displayImages.map((img, index) => (
                        <SwiperSlide key={index}>
                            <img   src={`${image_api}${img.imageId || img}`} alt={`Thumb ${index + 1}`} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </>
    );
};

export default ProductGallery;