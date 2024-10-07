"use client"

import coins from "@/data/coins/coins.json"
import { Label } from "@/components/ui/label"
import { AnimatePresence, motion } from "framer-motion"
import ConnectButton from "@/components/wallet/connect-button"
import items from "@/data/items/items.json";
import { CardDonation } from "./CardDonation"

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
};

export const Donation = () => {
    return (
        <div className="w-full p-4">
            <div className="flex flex-col space-y-2">
                <div className="flex flex-col w-full justify-center items-center gap-2">
                    <Label className="text-3xl font-bold">
                        <Label className="text-textSecondary text-3xl font-bold">Crypto</Label>&nbsp;Donation
                    </Label>
                    <Label>Select an item to start donation</Label>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full flex justify-center pt-5"
                >
                    <ConnectButton />
                </motion.div>
                <AnimatePresence mode="wait">
                    <div className="w-full p-4">
                        <div className="space-y-1">
                            <div className="flex flex-row flex-wrap gap-5 justify-center">
                                {items.map((item: Item) => (
                                    <motion.div
                                        key={item.id}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        transition={{ duration: 0.3 }}
                                    >
                                        <CardDonation
                                            id={item.id}
                                            name={item.name}
                                            link={item.link}
                                            image={item.image}
                                            price={item.price}
                                            source={item.source}
                                            coins={coins}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </AnimatePresence>
            </div>
        </div>
    )
}
