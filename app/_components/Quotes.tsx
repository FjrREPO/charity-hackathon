"use client";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const words = ` Every small act of kindness makes a big difference`;

export function Quotes() {
    return <TextGenerateEffect words={words} />;
}
