"use client";

import Hero from "./Hero";
import ImageSlider from "./ImageSlider";
import { Quotes } from "./Quotes";

export default function Homepage() {

    return (
        <>
            <Hero />
            <ImageSlider/>
            <div className="flex items-center justify-center w-full h-[50vh] px-[10vw]">
                <Quotes/>
            </div>
        </>
    );
}