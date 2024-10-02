"use client"

import {
    QueryClient,
    QueryClientProvider,
    useQuery
} from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ChevronDown, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState } from 'react'

const queryClient = new QueryClient()

interface CoinItem {
    id: string
    name: string
    description: string
    image: string
}

const fetchCoins = async (): Promise<CoinItem[]> => {
    const response = await fetch('/api/coins')
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`)
    }
    return response.json()
}

const FormCoin = ({ coins }: { coins: CoinItem[] }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedCoin, setSelectedCoin] = useState<CoinItem | null>(null)

    const handleSelect = (coinId: string) => {
        const coin = coins.find(c => c.id === coinId)
        setSelectedCoin(coin || null)
    }

    return (
        <div className="max-w-md mx-auto p-4 bg-gray-950 text-white">
            <Tabs defaultValue="transfer">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger
                        value="transfer"
                        className="data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-400"
                    >
                        Transfer
                    </TabsTrigger>
                    <TabsTrigger
                        value="withdraw"
                        className="data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-400"
                    >
                        Withdraw
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="transfer">
                    <div className="space-y-6">
                        <div>
                            <p className="mb-2">Transfer</p>
                            <Select>
                                <SelectTrigger className="w-full bg-gray-900 border-none">
                                    <div className="flex items-center">
                                        <img src="/api/placeholder/20/20" alt="IDR flag" className="w-5 h-5 rounded-full mr-2" />
                                        <SelectValue placeholder="IDR" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="idr">IDR</SelectItem>
                                    <SelectItem value="usd">USD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <p className="mb-2">Receive</p>
                            <Select onValueChange={handleSelect}>
                                <SelectTrigger className="w-full bg-gray-900 border-none">
                                    <div className="flex items-center">
                                        <SelectValue placeholder="Select Coin" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    {coins.map((coin) => (
                                        <SelectItem key={coin.id} value={coin.id}>
                                            <div className="flex items-center">
                                                <img src={coin.image} alt={`${coin.name} logo`} className="w-5 h-5 mr-2" />
                                                {coin.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <p className="mb-2">Transfer method</p>
                            <Select>
                                <SelectTrigger className="w-full bg-gray-900 border-none">
                                    <SelectValue placeholder="Choose transfer method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bank">Bank Transfer</SelectItem>
                                    <SelectItem value="card">Credit Card</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                            <CollapsibleTrigger asChild>
                                <Card className="w-full bg-gray-900 border-none cursor-pointer">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-center">
                                            <p className='text-emerald-400'>You'll receive an estimate of 0 {selectedCoin?.name || 'ETH'} for 0 IDR</p>
                                            <ChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="bg-gray-900 p-4 rounded-b-lg space-y-4">
                                <div className="flex justify-between items-center">
                                    <p>Rate</p>
                                    <p className="text-emerald-400">1 {selectedCoin?.name || 'ETH'} = 37,608,035 IDR</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <p>Estimated Network Fee</p>
                                        <Info className="w-4 h-4" />
                                    </div>
                                    <p>0</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <p>Processing Fee</p>
                                        <Info className="w-4 h-4" />
                                    </div>
                                    <p>0</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <p>Tax</p>
                                        <Info className="w-4 h-4" />
                                    </div>
                                    <p>0</p>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        <p className="text-center text-sm text-gray-400">Quote updates in 2s</p>

                        <Button className="w-full bg-emerald-400 hover:bg-emerald-500 text-black">
                            Connect wallet
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="withdraw">
                    <div className="p-4 text-center">
                        <p>Withdraw functionality coming soon</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

const LoadingSkeleton = () => (
    <div className="space-y-4">
        {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                        <Skeleton className="h-5 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                </CardHeader>
            </Card>
        ))}
    </div>
)

const ErrorAlert = ({ message }: { message: string }) => (
    <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
    </Alert>
)

const CoinList = () => {
    const { data: coins, isError, error, isLoading } = useQuery({
        queryKey: ['coins'],
        queryFn: fetchCoins,
    })

    if (isLoading) return <LoadingSkeleton />
    if (isError) return <ErrorAlert message={error instanceof Error ? error.message : 'An error occurred'} />
    if (!coins) return null

    return (
        <div className="container max-w-2xl mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Crypto Coin Swap</CardTitle>
                    <CardDescription>Select a coin to start swapping cryptocurrencies</CardDescription>
                </CardHeader>
                <CardContent>
                    <FormCoin coins={coins} />
                </CardContent>
            </Card>
        </div>
    )
}

export default function HomePage() {
    return (
        <QueryClientProvider client={queryClient}>
            <CoinList />
        </QueryClientProvider>
    )
}