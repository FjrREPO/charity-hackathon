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
            <div className="space-y-6">
                <div className="w-full flex justify-center">
                    <ConnectButton/>
                </div>
                <div>
                    <Label className="mb-2 text-md">Transfer</Label>
                    <div className="relative h-[70px]">
                        <Input
                            type="text"
                            value={amount}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAmountChange(e.target.value)}
                            className="h-full relative text-end text-2xl"
                        />
                        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-auto h-[80%] absolute top-1/2 left-2 -translate-y-1/2" variant={"secondary"}>
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
                </div>

                <div>
                    <Label className="mb-2 text-md">Receive</Label>
                    <div className="relative h-[70px]">
                        <Input
                            type="text"
                            value={parseInt(estimatedReceive).toFixed(2)}
                            disabled
                            className="h-full relative text-end text-2xl"
                        />
                        <Button className="w-auto h-[80%] absolute top-1/2 left-2 -translate-y-1/2" variant={"secondary"}>
                            {usdtCoin && (
                                <img src={usdtCoin.image} alt="usdt" className="w-5 h-5 rounded-full mr-2" />
                            )}
                            {usdtCoin?.symbol || "USDT"}
                        </Button>
                    </div>
                </div>

                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <CollapsibleTrigger asChild>
                        <Card className="w-full border-none cursor-pointer">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-emerald-400">You&quot;ll send {amount} {selectedCoin?.name}</p>
                                    <ChevronDown className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                                </div>
                            </CardContent>
                        </Card>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 rounded-b-lg space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Rate</Label>
                            <Label className="text-emerald-400 font-bold text-md">{selectedCoinPrice ? selectedCoinPrice.toFixed(2) : "0"} USDT</Label>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Label>Estimated Network Fee</Label>
                                <Info className="w-4 h-4 text-emerald-400" />
                            </div>
                            <Label className="text-emerald-400 font-bold text-md">{estimatedNetworkFee} USDT</Label>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Label>Processing Fee</Label>
                                <Info className="w-4 h-4 text-emerald-400" />
                            </div>
                            <Label className="text-emerald-400 font-bold text-md">{processingFee} USDT</Label>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Label>Tax</Label>
                                <Info className="w-4 h-4 text-emerald-400" />
                            </div>
                            <Label className="text-emerald-400 font-bold text-md">{tax} USDT</Label>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Label>Total</Label>
                                <Info className="w-4 h-4 text-emerald-400" />
                            </div>
                            <Label className="text-emerald-400 font-bold text-md">{totalAmount.toFixed(2)} USDT</Label>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
                <Label className="text-center text-sm text-gray-400">Quote updates in {countdown}s</Label>
            </div>
        </div>
    );
};
