import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Thumbs } from 'swiper/modules';

import './Product.css';

import {URLS} from '../../constants/urls';
import LazyImage from "../../utils/LazyImage.jsx";

const image_api =  URLS.s3_bucket;

const ProductGallery = ({ images, fallbackImage, productName }) => {
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
                            src={img.imageId ? `${image_api}${img.imageId}_large.webp` : '/img/icon.png'}
                            alt={`Купити ${productName} в Moki`}
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
                            <LazyImage
                                src={`${image_api}${img.imageId || img}_thumb.webp`}
                                alt={`Купити ${productName} в Moki`}
                                className="thumb-img-wrapper"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </>
    );
};

export default ProductGallery;