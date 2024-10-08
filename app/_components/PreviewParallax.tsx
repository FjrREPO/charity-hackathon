"use client";

import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";

export function PreviewParallax() {
    const title = "Now We Focused on Indonesian People!"
    const description = "Welcome to our charity donation platform dedicated to the people of Indonesia! Together, we can make a real difference in the lives of those in need, from underprivileged children to communities affected by disasters. Every contribution, no matter how small, brings hope and helps build a brighter future. Join us in spreading kindness and creating positive change across the archipelago!"

    return <HeroParallax products={products} title={title} description={description}/>;
}
export const products = [
    {
        title: "Yayasan Indonesia Foundation",
        thumbnail:
            "https://res.cloudinary.com/dutlw7bko/image/upload/v1728349386/charity-hackathon/dokumentasi/images__7_-transformed_blcua4.jpg",
    },
    {
        title: "Yayasan Anak Yatim di Jakarta Timur",
        thumbnail:
            "https://res.cloudinary.com/dutlw7bko/image/upload/v1728349517/charity-hackathon/dokumentasi/HUM_6671_h4gxka.jpg",
    },
    {
        title: "Yayasan Bersih dan Anak Disabilitas",
        thumbnail:
            "https://res.cloudinary.com/dutlw7bko/image/upload/v1728349385/charity-hackathon/dokumentasi/IMG-20240123-WA0035_ajlo87.jpg",
    },

    {
        title: "Yayasan Anak Yatim di Jakarta Barat",
        thumbnail:
            "https://res.cloudinary.com/dutlw7bko/image/upload/v1728349386/charity-hackathon/dokumentasi/IMG-20240928-WA0085-1000x540-transformed_cgpcvp.jpg",
    },
    {
        title: "Yayasan Anak Yatim di Jakarta Pusat",
        thumbnail:
            "https://res.cloudinary.com/dutlw7bko/image/upload/v1728349386/charity-hackathon/dokumentasi/IMG_8527-scaled_hsu6dl.jpg",
    },
    {
        title: "Yayasan Anak Yatim di Bali",
        thumbnail:
            "https://res.cloudinary.com/dutlw7bko/image/upload/v1728349387/charity-hackathon/dokumentasi/86anak_yatim_panti_asuhan-riau_eksis-ilustrasi-transformed_jptdra.jpg",
    },

    {
        title: "Yayasan Anak Yatim di Jakarta Selatan",
        thumbnail:
            "https://res.cloudinary.com/dutlw7bko/image/upload/v1728349387/charity-hackathon/dokumentasi/605549e6b5fa9-transformed_pbd35n.jpg",
    },
    {
        title: "Yayasan Anak Yatim di Jakarta Utara",
        thumbnail:
            "https://res.cloudinary.com/dutlw7bko/image/upload/v1728349389/charity-hackathon/dokumentasi/IMG-20240831-WA0023-5__dupcGE-transformed_qat8m1.jpg",
    },
    {
        title: "Yayasan Anak Yatim di Jakarta",
        thumbnail:
            "https://res.cloudinary.com/dutlw7bko/image/upload/v1728349517/charity-hackathon/dokumentasi/HUM_6671_h4gxka.jpg",
    },
    {
        title: "Yayasan Anak Yatim di Jakarta",
        thumbnail:
            "https://res.cloudinary.com/dutlw7bko/image/upload/v1728349826/charity-hackathon/dokumentasi/DSC09662-min-1024x683-transformed_amzcrh.jpg",
    },
    {
        title: "Yayasan Anak Yatim di Jakarta",
        thumbnail:
            "https://res.cloudinary.com/dutlw7bko/image/upload/v1728349826/charity-hackathon/dokumentasi/Yayasan-Anak-Yatim-di-Jakarta-Timur-transformed_khweuu.jpg",
    },

    {
        title: "Yayasan Anak Yatim di Jakarta",
        thumbnail:
            "https://res.cloudinary.com/dutlw7bko/image/upload/v1728349827/charity-hackathon/dokumentasi/IMG-20231023-WA0005-transformed_uesflc.jpg",
    },
    {
        title: "Yayasan Anak Yatim di Jakarta",
        thumbnail:
            "https://res.cloudinary.com/dutlw7bko/image/upload/v1728349967/charity-hackathon/dokumentasi/IMG-20240617-WA0137-transformed_lukc7u.jpg",
    },
    {
        title: "Yayasan Anak Yatim di Jakarta",
        thumbnail:
            "https://res.cloudinary.com/dutlw7bko/image/upload/v1728349967/charity-hackathon/dokumentasi/Yayasan-Bersih-dan-anak-disabilitas-transformed_wlb3ds.jpg",
    },
    {
        title: "Yayasan Anak Yatim di Jakarta",
        thumbnail:
            "https://res.cloudinary.com/dutlw7bko/image/upload/v1728349967/charity-hackathon/dokumentasi/DSC08044-transformed_qgv5vh.jpg",
    },
];