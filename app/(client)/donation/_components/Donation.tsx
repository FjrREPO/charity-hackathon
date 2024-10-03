"use client"

import {
    useQuery
} from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ChevronDown, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState, useMemo, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import SkeletonWrapper from '@/components/SkeletonWrapper'
import coins from '@/data/coins/coins.json'
import { Label } from '@/components/ui/label'
import Image from 'next/image'

interface CoinItem {
    id: string;
    symbol: string;
    name: string;
    network: string;
    network_symbol: string;
    chain_id: number;
    is_maintenance: boolean;
    is_token: boolean;
    contract_address: string;
    decimals: number;
    max_trade_decimals: number;
    image: string;
}

interface Quote {
    price: number;
    volume_24h: number;
    volume_change_24h: number;
    percent_change_1h: number;
    percent_change_24h: number;
    percent_change_7d: number;
    percent_change_30d: number;
    percent_change_60d: number;
    percent_change_90d: number;
    market_cap: number;
    market_cap_dominance: number;
    fully_diluted_market_cap: number;
    tvl: number | null;
    last_updated: string;
}

interface CryptoCurrency {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    num_market_pairs: number;
    date_added: string;
    tags: string[];
    max_supply: number;
    circulating_supply: number;
    total_supply: number;
    infinite_supply: boolean;
    platform: null;
    cmc_rank: number;
    self_reported_circulating_supply: number | null;
    self_reported_market_cap: number | null;
    tvl_ratio: number | null;
    last_updated: string;
    quote: {
        USD: Quote;
    };
}

const fetchCrypto = async (): Promise<CryptoCurrency[]> => {
    const response = await fetch('/api/crypto')
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`)
    }
    const data = await response.json()
    return data.data
}

const defaultCoin: CoinItem = {
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

const FormCoin = ({ coins, cryptos, refetch }: { coins: CoinItem[], cryptos: CryptoCurrency[], refetch: () => void }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedCoin, setSelectedCoin] = useState<CoinItem | null>(defaultCoin)
    const [amount, setAmount] = useState<string>('1')
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [countdown, setCountdown] = useState(10);

    const estimatedNetworkFee = 2;
    const processingFee = 1;
    const tax = 0.1;

    useEffect(() => {
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
    }, [refetch]);

    const selectedCoinPrice = useMemo(() => {
        if (selectedCoin) {
            const cryptoData = cryptos.find(c => c.symbol === selectedCoin.symbol);
            return cryptoData?.quote.USD.price || null;
        }
        return null;
    }, [selectedCoin, cryptos]);

    const handleSelect = (coinId: string) => {
        const coin = coins.find(c => c.id === coinId)
        setSelectedCoin(coin || null);
        setDialogOpen(false);
    }

    const handleAmountChange = (value: string) => {
        if (/^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    }

    const calculateEstimatedReceive = () => {
        if (amount && selectedCoinPrice) {
            return (parseFloat(selectedCoinPrice.toString()) * parseFloat(amount) - estimatedNetworkFee).toFixed(8);
        }
        return '0';
    }

    const totalAmount = parseFloat(calculateEstimatedReceive()) + estimatedNetworkFee + processingFee + tax;

    const usdtCoin = useMemo(() => coins.find(coin => coin.symbol === 'USDT'), [coins]);

    return (
        <div className="max-w-md mx-auto p-4 bg-gray-950 text-white">
            <div className="space-y-6">
                <div>
                    <Label className="mb-2 text-md">Transfer</Label>
                    <div className='relative h-[70px]'>
                        <Input
                            type='number'
                            value={amount}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            className='h-full relative text-end text-2xl'
                        />
                        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger>
                                <Button
                                    className='w-auto h-[80%] absolute top-1/2 left-2 -translate-y-1/2'
                                    onClick={() => setDialogOpen(true)}
                                >
                                    {selectedCoin && (
                                        <img src={selectedCoin.image} alt={selectedCoin.name} className="w-5 h-5 rounded-full mr-2" />
                                    )}
                                    {selectedCoin?.symbol || 'Select Coin'}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <Label className='pl-5 text-xl font-semibold'>Select a currency</Label>
                                <ScrollArea className="max-h-80 overflow-auto flex flex-col w-full h-auto gap-2">
                                    {coins.map((coin) => (
                                        <Button key={coin.id} value={coin.id} variant={'ghost'} className="w-full h-auto flex justify-between items-center" onClick={() => handleSelect(coin.id)}>
                                            <div className='flex flex-row items-center cursor-pointer justify-start'>
                                                <Image src={coin.image} alt={`${coin.name} logo`} className="w-10 h-10 mr-2" height={100} width={100} />
                                                <div className='flex flex-col items-start justify-center gap-3'>
                                                    <Label className='cursor-pointer'>{coin.symbol}</Label>
                                                    <Label className='cursor-pointer text-gray-500'>{coin.name} ({coin.network})</Label>
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
                    <div className='relative'>
                        <Input type='number' value={calculateEstimatedReceive()} disabled className='h-[70px] relative text-end text-2xl' />
                        <Button className='w-auto h-[80%] absolute top-1/2 left-2 -translate-y-1/2' variant={'default'}>
                            {usdtCoin && (
                                <img src={usdtCoin.image} alt="usdt" className="w-5 h-5 rounded-full mr-2" />
                            )}
                            {usdtCoin?.symbol || 'USDT'}
                        </Button>
                    </div>
                </div>

                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <CollapsibleTrigger asChild>
                        <Card className="w-full bg-gray-900 border-none cursor-pointer">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                    <p className='text-emerald-400'>You'll send {amount} {selectedCoin?.name}</p>
                                    <ChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                </div>
                            </CardContent>
                        </Card>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="bg-gray-900 p-4 rounded-b-lg space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Rate</Label>
                            <Label className="text-emerald-400 font-bold text-lg">{selectedCoinPrice ? `1 ${selectedCoin?.name} = ${selectedCoinPrice.toFixed(2)} USDT` : '0'}</Label>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Label>Estimated Network Fee</Label>
                                <Info className="w-4 h-4 text-emerald-400" />
                            </div>
                            <Label className="text-emerald-400 font-bold text-lg">{estimatedNetworkFee} USDT</Label>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Label>Processing Fee</Label>
                                <Info className="w-4 h-4 text-emerald-400" />
                            </div>
                            <Label className="text-emerald-400 font-bold text-lg">{processingFee} USDT</Label>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Label>Tax</Label>
                                <Info className="w-4 h-4 text-emerald-400" />
                            </div>
                            <Label className="text-emerald-400 font-bold text-lg">{tax} USDT</Label>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Label>Estimate</Label>
                                <Info className="w-4 h-4 text-emerald-400" />
                            </div>
                            <Label className="text-emerald-400 font-bold text-lg">{totalAmount} USDT</Label>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
                <p className="text-center text-sm text-gray-400">Quote updates in {countdown}s</p>
                <Button className="w-full bg-emerald-400 hover:bg-emerald-500 text-black">
                    Connect wallet
                </Button>
            </div>
        </div>
    )
}

const ErrorAlert = ({ message }: { message: string }) => (
    <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
    </Alert>
)

const CoinList = () => {
    const { data: cryptos, isError: isCryptosError, error: cryptosError, isLoading: isCryptosLoading, refetch } = useQuery({
        queryKey: ['cryptos'],
        queryFn: fetchCrypto,
        refetchInterval: 10000
    })

    if (!cryptos) return <ErrorAlert message="An error occurred fetching crypto data" />
    if (isCryptosError) return <ErrorAlert message={cryptosError instanceof Error ? cryptosError.message : 'An error occurred fetching crypto data'} />

    return (
        <div className="container max-w-2xl mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Crypto Coin Donation</CardTitle>
                    <CardDescription>Select a coin to start donation cryptocurrencies</CardDescription>
                </CardHeader>
                <CardContent>
                    <SkeletonWrapper isLoading={isCryptosLoading}>
                        <FormCoin coins={coins} cryptos={cryptos} refetch={refetch} />
                    </SkeletonWrapper>
                </CardContent>
            </Card>
        </div>
    )
}

export default function Donation() {
    return (
        <CoinList />
    )
}