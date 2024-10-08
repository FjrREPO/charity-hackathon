"use client";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const words = `Empower change with every transaction, let your crypto donations to Musang Charity be the spark that ignites hope and transforms lives.
`;

export function Quotes() {
    return <TextGenerateEffect words={words} />;
}
