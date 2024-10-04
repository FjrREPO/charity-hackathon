"use client";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
    children,
    className,
    containerClassName,
    colors,
    waveWidth,
    backgroundFill,
    blur = 10,
    speed = "fast",
    waveOpacity = 0.5,
    ...props
}: {
    children?: React.ReactNode;
    className?: string;
    containerClassName?: string;
    colors?: string[];
    waveWidth?: number;
    backgroundFill?: string;
    blur?: number;
    speed?: "slow" | "fast";
    waveOpacity?: number;
    [key: string]: number | undefined | string | React.ReactNode;
}) => {
    const noise = createNoise3D();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isSafari, setIsSafari] = useState(false);
    const { theme } = useTheme();
    const animationRef = useRef<number>();

    const getSpeed = () => (speed === "fast" ? 0.002 : 0.001);

    const waveColors = colors || [
        "#38bdf8",
        "#818cf8",
        "#c084fc",
        "#e879f9",
        "#22d3ee",
    ];

    const drawWave = (ctx: CanvasRenderingContext2D, w: number, h: number, nt: number) => {
        ctx.fillStyle = theme === 'dark' ? "black" : "white";
        ctx.globalAlpha = waveOpacity || 0.5;
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.lineWidth = waveWidth || 50;
            ctx.strokeStyle = waveColors[i % waveColors.length];
            for (let x = 0; x < w; x += 5) {
                const y = noise(x / 800, 0.3 * i, nt) * 100;
                ctx.lineTo(x, y + h * 0.5);
            }
            ctx.stroke();
            ctx.closePath();
        }
    };

    const render = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (!canvas || !ctx) return;

        let w = (ctx.canvas.width = window.innerWidth);
        let h = (ctx.canvas.height = window.innerHeight);
        ctx.filter = `blur(${blur}px)`;

        let nt = 0;
        const renderLoop = () => {
            drawWave(ctx, w, h, nt);
            nt += getSpeed();
            animationRef.current = requestAnimationFrame(renderLoop);
        };
        renderLoop();
    };

    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!canvas || !ctx) return;

            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
            ctx.filter = `blur(${blur}px)`;
        };

        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [blur]);

    useEffect(() => {
        setIsSafari(
            typeof window !== "undefined" &&
            navigator.userAgent.includes("Safari") &&
            !navigator.userAgent.includes("Chrome")
        );
    }, []);

    useEffect(() => {
        render();
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [theme]); // Re-render when theme changes

    return (
        <div
            className={cn(
                "h-screen flex flex-col items-center justify-center",
                containerClassName
            )}
        >
            <canvas
                className="absolute inset-0 z-0 w-full h-full"
                ref={canvasRef}
                style={{
                    ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
                }}
            />
            <div className={cn("relative z-10", className)} {...props}>
                {children}
            </div>
        </div>
    );
};