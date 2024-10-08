"use client";

import React from "react";
import { WavyBackground } from "@/components/ui/wavy-background";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export default function Hero() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2
            }
        },
        tap: {
            scale: 0.95
        }
    };

    return (
        <WavyBackground className="max-w-full h-full flex flex-col justify-center items-center mx-auto">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center max-w-[80vw]"
            >
                <motion.div variants={itemVariants}>
                    <Label className="flex md:pb-2 text-4xl md:text-6xl lg:text-7xl font-bold inter-var text-center">
                        <Label className="text-textSecondary text-4xl md:text-6xl lg:text-7xl font-bold inter-var">Musang</Label>&nbsp;Charity
                    </Label>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                    <Label className="flex justify-center text-center md:text-lg mt-4 font-normal inter-var">
                        Musang Charity is a non-profit organization that aims to help people in need.
                    </Label>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                    <Link href="/donation">
                        <motion.div
                            whileHover="hover"
                            whileTap="tap"
                            variants={buttonVariants}
                        >
                            <Button variant="default" className="mt-4">
                                Donate Now
                            </Button>
                        </motion.div>
                    </Link>
                </motion.div>
            </motion.div>
        </WavyBackground>
    );
}