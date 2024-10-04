import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useCallback } from "react";
import ConnectButton from "@/components/wallet/connect-button";
import { TbCircleArrowDownFilled } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";

const defaultCoin = {
    id: "4e61bb64-317e-4651-8285-b26945357e0d",
    symbol: "ETH",
    name: "Ethereum",
    network: "Ethereum",
    network_symbol: "ETH",
    chain_id: 1,
    is_maintenance: false,
    is_token: false,
    contract_address: "",
    decimals: 18,
    max_trade_decimals: 8,
    image: "https://cdn.normi.es/coin-image/eth_eth.svg"
};

export const FormCoin = ({
    coins,
    cryptos,
    refetch
}: {
    coins: CoinItem[],
    cryptos: CryptoCurrency[] | undefined,
    refetch: () => void
}) => {
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [selectedCoin, setSelectedCoin] = useState(defaultCoin);
    const [amount, setAmount] = useState("1");
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [countdown, setCountdown] = useState(10);

    const estimatedNetworkFee = 2;
    const processingFee = 1;
    const tax = 0.1;

    useEffect(() => {
        setMounted(true);
    }, []);

    const selectedCoinPrice = useMemo(() => {
        if (!cryptos) return 0;
        const cryptoData = cryptos.find((c: CryptoCurrency) => c.symbol === selectedCoin.symbol);
        return cryptoData?.quote?.USD?.price || 0;
    }, [selectedCoin.symbol, cryptos]);

    useEffect(() => {
        if (!mounted) return;

        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    refetch();
                    return 10;
                }
                return prevCountdown - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [refetch, mounted]);

    const handleSelect = useCallback((coinId: string) => {
        const coin = coins.find((c: CoinItem) => c.id === coinId);
        setSelectedCoin(coin || defaultCoin);
        setDialogOpen(false);
    }, [coins]);

    const handleAmountChange = useCallback((value: string) => {
        if (/^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    }, []);

    const calculateEstimatedReceive = useCallback(() => {
        if (amount && selectedCoinPrice) {
            return (parseFloat(amount) * selectedCoinPrice).toFixed(8);
        }
        return "0";
    }, [amount, selectedCoinPrice]);

    const estimatedReceive = useMemo(() => calculateEstimatedReceive(), [calculateEstimatedReceive]);
    const totalAmount = parseFloat(estimatedReceive) + estimatedNetworkFee + processingFee + tax;
    const usdtCoin = useMemo(() => coins?.find((coin: CoinItem) => coin.symbol === "USDT"), [coins]);

    if (!mounted) {
        return null;
    }

    return (
        <div className="max-w-md mx-auto p-4">
            <div className="space-y-1">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full flex justify-center"
                >
                    <ConnectButton />
                </motion.div>
                <Label className="flex relative justify-center mb-2 text-md font-bold w-full py-2">Send</Label>
                <div className="flex relative flex-col h-fit w-auto gap-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="relative h-[70px]">
                            <Input
                                type="text"
                                value={amount}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAmountChange(e.target.value)}
                                className="h-full relative text-end text-2xl border-[3px] rounded-2xl"
                            />
                            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-auto h-[80%] absolute top-1/2 left-2 -translate-y-1/2 rounded-xl" variant={"secondary"}>
                                        {selectedCoin && (
                                            <img src={selectedCoin.image} alt={selectedCoin.name} className="w-5 h-5 rounded-full mr-2" />
                                        )}
                                        {selectedCoin?.symbol || "Select Coin"}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <Label className="pl-5 text-xl font-semibold">Select a currency</Label>
                                    <ScrollArea className="max-h-80 overflow-auto flex flex-col w-full h-auto gap-2">
                                        {coins.map((coin: CoinItem) => (
                                            <Button key={coin.id} value={coin.id} variant={"ghost"} className="w-full h-auto flex justify-between items-center" onClick={() => handleSelect(coin.id)}>
                                                <div className="flex flex-row items-center cursor-pointer justify-start">
                                                    <Image src={coin.image} alt={`${coin.name} logo`} className="w-10 h-10 mr-2" height={100} width={100} />
                                                    <div className="flex flex-col items-start justify-center gap-3">
                                                        <Label className="cursor-pointer">{coin.symbol}</Label>
                                                        <Label className="cursor-pointer text-gray-500">{coin.name} ({coin.network})</Label>
                                                    </div>
                                                </div>
                                            </Button>
                                        ))}
                                    </ScrollArea>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                        <TbCircleArrowDownFilled className="w-9 h-9 text-gray-600 dark:text-gray-400 bg-white dark:bg-black rounded-full" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <div className="relative h-[70px]">
                            <Input
                                type="text"
                                value={parseFloat(estimatedReceive).toFixed(4)}
                                disabled
                                className="h-full relative text-end text-2xl border-[3px] rounded-2xl"
                            />
                            <Button className="w-auto h-[80%] absolute top-1/2 left-2 -translate-y-1/2 rounded-xl" variant={"secondary"}>
                                {usdtCoin && (
                                    <img src={usdtCoin.image} alt="usdt" className="w-5 h-5 rounded-full mr-2" />
                                )}
                                {usdtCoin?.symbol || "USDT"}
                            </Button>
                        </div>
                    </motion.div>
                </div>

                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <CollapsibleTrigger asChild>
                        <Card className="w-full border-none cursor-pointer">
                            <CardContent className="p-4">
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex justify-between items-center"
                                >
                                    <p className="text-textSecondary">You&apos;ll send {amount} {selectedCoin?.name}</p>
                                    <ChevronDown />
                                </motion.div>
                            </CardContent>
                        </Card>
                    </CollapsibleTrigger>
                    <AnimatePresence>
                        {isOpen && (
                            <CollapsibleContent
                                forceMount
                                asChild
                            >
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-4 rounded-b-lg space-y-4 overflow-hidden"
                                >
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.35 }}
                                        className="flex justify-between items-center">
                                        <Label>Rate</Label>
                                        <Label className="text-textSecondary font-bold text-md">1 {selectedCoin?.symbol} = {selectedCoinPrice ? selectedCoinPrice.toFixed(4) : "0"} USDT</Label>
                                    </motion.div>
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Label>Estimated Network Fee</Label>
                                            <Info className="w-4 h-4 text-textSecondary" />
                                        </div>
                                        <Label className="text-textSecondary font-bold text-md">{estimatedNetworkFee} USDT</Label>
                                    </motion.div>
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.45 }}
                                        className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Label>Processing Fee</Label>
                                            <Info className="w-4 h-4 text-textSecondary" />
                                        </div>
                                        <Label className="text-textSecondary font-bold text-md">{processingFee} USDT</Label>
                                    </motion.div>
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Label>Tax</Label>
                                            <Info className="w-4 h-4 text-textSecondary" />
                                        </div>
                                        <Label className="text-textSecondary font-bold text-md">{tax} USDT</Label>
                                    </motion.div>
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.55 }}
                                        className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Label>Total</Label>
                                            <Info className="w-4 h-4 text-textSecondary" />
                                        </div>
                                        <Label className="text-textSecondary font-bold text-md">{totalAmount.toFixed(4)} USDT</Label>
                                    </motion.div>
                                </motion.div>
                            </CollapsibleContent>
                        )}
                    </AnimatePresence>
                </Collapsible>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    <Label className="text-center text-sm text-gray-400">Quote updates in {countdown}s</Label>
                </motion.div>
            </div>
        </div>
    );
};
