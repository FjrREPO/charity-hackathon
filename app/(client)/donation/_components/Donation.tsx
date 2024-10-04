"use client"

import {
    useQuery
} from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SkeletonWrapper from "@/components/SkeletonWrapper"
import { FormCoin } from "./FormCoin"
import coins from "@/data/coins/coins.json"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"

const fetchCryptoCurrency = async (): Promise<CryptoCurrency[]> => {
    const response = await fetch("/api/coinmarketcap/currency")
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`)
    }
    const data = await response.json()
    return data.data
}

const CoinList = ({ cryptos, isLoading, refetch }: { cryptos: CryptoCurrency[] | undefined, isLoading: boolean, refetch: () => void }) => {
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delayChildren: 0.3,
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0
        }
    }

    return (
        <motion.div
            className="container max-w-xl mx-auto p-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <Card>
                    <CardHeader className="text-center">
                        <motion.div variants={itemVariants}>
                            <CardTitle className="text-xl font-bold">
                                <Label className="text-textSecondary text-xl font-bold">Crypto</Label>&nbsp;Donation
                            </CardTitle>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <CardDescription>Select a coin to start donation cryptocurrencies</CardDescription>
                        </motion.div>
                    </CardHeader>
                    <CardContent>
                        <AnimatePresence mode="wait">
                            <SkeletonWrapper isLoading={isLoading}>
                                <FormCoin coins={coins} cryptos={cryptos} refetch={refetch} />
                            </SkeletonWrapper>
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    )
}

export default function Donation() {
    const { data: cryptos, isLoading, refetch } = useQuery({
        queryKey: ["cryptos"],
        queryFn: fetchCryptoCurrency,
        refetchInterval: 10000
    })
    return (
        <CoinList cryptos={cryptos} isLoading={isLoading} refetch={refetch} />
    )
}