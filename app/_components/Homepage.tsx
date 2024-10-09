"use client";

import Hero from "./Hero";
import { PreviewParallax } from "./PreviewParallax";

export default function Homepage() {

    return (
        <>
            <Hero />
            <div className="hidden sm:block">
                <PreviewParallax />
            </div>
        </>
    );
}