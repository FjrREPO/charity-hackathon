"use client";
import { useEffect, useState } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
    words,
    className,
    filter = true,
    duration = 0.5,
}: {
    words: string;
    className?: string;
    filter?: boolean;
    duration?: number;
}) => {
    const [scope, animate] = useAnimate();
    const [showClosingQuote, setShowClosingQuote] = useState(false);
    const wordsArray = words.split(" ");

    useEffect(() => {
        animate(
            "span",
            {
                opacity: 1,
                filter: filter ? "blur(0px)" : "none",
            },
            {
                duration: duration,
                delay: stagger(0.2),
            }
        ).then(() => {
            setTimeout(() => {
                setShowClosingQuote(true);
            }, duration * 1000);
        });
    }, [scope.current, animate, duration, filter]);

    const renderWords = () => (
        <motion.div ref={scope}>
            &ldquo;
            {wordsArray.map((word, idx) => (
                <motion.span
                    key={word + idx}
                    className="opacity-0"
                    style={{
                        filter: filter ? "blur(10px)" : "none",
                    }}
                >
                    {word}{" "}
                </motion.span>
            ))}
            {showClosingQuote && <>&rdquo;</>}
        </motion.div>
    );

    return (
        <div className={cn("font-bold", className)}>
            <div className="mt-4">
                <div className="text-2xl sm:text-4xl text-center leading-snug tracking-wide">
                    {renderWords()}
                </div>
            </div>
        </div>
    );
};