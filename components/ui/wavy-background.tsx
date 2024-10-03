"use client";
import { cn } from "@/lib/utils";
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
    let animationId: number;

    const getSpeed = () => (speed === "fast" ? 0.002 : 0.001);

    const init = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (!canvas || !ctx) return;

        let w = (ctx.canvas.width = window.innerWidth);
        let h = (ctx.canvas.height = window.innerHeight);
        ctx.filter = `blur(${blur}px)`;

        window.onresize = () => {
            w = (ctx.canvas.width = window.innerWidth);
            h = (ctx.canvas.height = window.innerHeight);
            ctx.filter = `blur(${blur}px)`;
        };

        render(ctx, w, h);
    };

    const waveColors = colors || [
        "#38bdf8",
        "#818cf8",
        "#c084fc",
        "#e879f9",
        "#22d3ee",
    ];

    const drawWave = (ctx: CanvasRenderingContext2D, w: number, h: number, nt: number) => {
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

    const render = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        let nt = 0;
        const renderLoop = () => {
            ctx.fillStyle = backgroundFill || "black";
            ctx.globalAlpha = waveOpacity || 0.5;
            ctx.fillRect(0, 0, w, h);
            nt += getSpeed();
            drawWave(ctx, w, h, nt);
            animationId = requestAnimationFrame(renderLoop);
        };
        renderLoop();
    };

    useEffect(() => {
        init();
        return () => {
            cancelAnimationFrame(animationId);
        };
    }, []);

    useEffect(() => {
        setIsSafari(
            typeof window !== "undefined" &&
            navigator.userAgent.includes("Safari") &&
            !navigator.userAgent.includes("Chrome")
        );
    }, []);

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
