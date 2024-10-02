"use client"

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, Info } from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

const TransferPage = () => {
    const [isOpen, setIsOpen] = useState(false)

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
                    <TabsTrigger value="withdraw">
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
                            <Select>
                                <SelectTrigger className="w-full bg-gray-900 border-none">
                                    <div className="flex items-center">
                                        <img src="/api/placeholder/20/20" alt="ETH logo" className="w-5 h-5 mr-2" />
                                        <SelectValue placeholder="ETH" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="eth">ETH</SelectItem>
                                    <SelectItem value="btc">BTC</SelectItem>
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
                                            <p>You'll receive an estimate of 0 ETH for 0 IDR</p>
                                            <ChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="bg-gray-900 p-4 rounded-b-lg space-y-4">
                                <div className="flex justify-between items-center">
                                    <p>Rate</p>
                                    <p className="text-emerald-400">1 ETH = 37,608,035 IDR</p>
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
            </Tabs>
        </div>
    )
}

export default TransferPage