"use client"

import { CardDonation } from "./CardDonation"
import coins from "@/data/coins/coins.json"
import { Label } from "@/components/ui/label"
import { AnimatePresence, motion } from "framer-motion"
import ConnectButton from "@/components/wallet/connect-button"

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
                    <CardDonation coins={coins} />
                </AnimatePresence>
            </div>
        </div>
    )
}