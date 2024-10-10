"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import foundation from "@/data/foundation/foundation.json";

import Image from "next/image";
import BlurImage from "@/components/BlurImage";

const ImageSlider = () => {
    return (
        <div className="flex w-full px-5">
            <Swiper
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                    },
                    800: {
                        slidesPerView: 3,
                    },
                }}
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}
                pagination={true}
                navigation={true}
                autoplay={{
                    delay: 2500,
                }}
                speed={1000}
                modules={[EffectCoverflow, Pagination, Autoplay, Navigation]}
                className="mySwiper"
            >
                {foundation.map((item, index) => (
                    <SwiperSlide key={index}>
                        <BlurImage
                            src={item.thumbnail}
                            alt={`Image ${index + 1}`}
                            width={1000}
                            height={600}
                            className="rounded-lg object-cover w-full h-auto"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ImageSlider;