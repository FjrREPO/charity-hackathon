"use client";
import React from "react";
import { WavyBackground } from "@/components/ui/wavy-background";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Homepage() {
    return (
        <WavyBackground className="max-w-full h-full flex flex-col justify-center items-center mx-auto">
            <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
                Musang Charity
            </p>
            <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
                Musang Charity is a non-profit organization that aims to help people in need.
            </p>
            <Link href="/donation">
                <Button variant="default" className="mt-4">Donate Now</Button>
            </Link>
        </WavyBackground>
    );
}