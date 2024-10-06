"use client";

import { useState } from "react";
import { Lens } from "../ui/lens";
import Image from "next/image";
import { motion } from "framer-motion";
import { placeholderBlurhash } from "@/lib/utils";
import { Label } from "../ui/label";
import BlurImage from "../BlurImage";
import { Button } from "../ui/button";
import { Beams } from "./beams";
import { Rays } from "./rays";
import Link from "next/link";
import { DialogDetailCard } from "./dialog-detail-card";

export function ItemCard({ id, name, link, image, price, source, coins }: Item) {
    const [hovering, setHovering] = useState(false);

    return (
        <div className="max-w-[300px]">
            <div className="w-full relative rounded-3xl overflow-hidden max-w-md mx-auto bg-gradient-to-r from-[#E0E7FF] to-[#F3F4F6] dark:from-[#1D2235] dark:to-[#121318] p-8">
                <Rays />
                <Beams />
                <div className="relative z-10">
                    <Lens hovering={hovering} setHovering={setHovering}>
                        <BlurImage
                            src={image || "https://res.cloudinary.com/dutlw7bko/image/upload/v1728224113/charity-hackathon/landscape-placeholder_greber.jpg"}
                            alt={name}
                            width={300}
                            height={300}
                            className="w-full rounded-md hover:scale-95 transform transition-transform duration-500 ease-in-out object-cover"
                            placeholder="blur"
                            blurDataURL={placeholderBlurhash}
                        />
                    </Lens>
                    <motion.div
                        animate={{
                            filter: hovering ? "blur(2px)" : "blur(0px)",
                        }}
                        className="py-4 relative z-20 flex flex-col gap-2"
                    >
                        <Label className="text-xl text-left font-bold line-clamp-2">
                            {name}
                        </Label>
                        <Label className="text-sm text-right text-gray-500">
                            Source: <Link href={link} className="hover:underline" target="_blank">{source}</Link>
                        </Label>
                        <DialogDetailCard
                            trigger={
                                <Button variant={"default"} className="flex flex-row gap-2">
                                    <Image
                                        src={coins?.image || ""}
                                        alt={coins?.name || ""}
                                        width={24}
                                        height={24}
                                        className="w-6 h-6"
                                    />
                                    <Label>
                                        {price}
                                    </Label>
                                </Button>
                            }
                            item={{ id, name, link, image, price, source, coins }}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}