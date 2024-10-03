"use client"

import {
    useQuery
} from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SkeletonWrapper from '@/components/SkeletonWrapper'
import coins from '@/data/coins/coins.json'
import { FormCoin } from './FormCoin'

const fetchCrypto = async (): Promise<CryptoCurrency[]> => {
    const response = await fetch('/api/crypto')
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`)
    }
    const data = await response.json()
    return data.data
}

const CoinList = ({ cryptos, isLoading, refetch }: { cryptos: CryptoCurrency[] | undefined, isLoading: boolean, refetch: () => void }) => {
    return (
        <div className="container max-w-2xl mx-auto p-4">
            <Card>
                <CardHeader className='text-center'>
                    <CardTitle>Crypto Donation</CardTitle>
                    <CardDescription>Select a coin to start donation cryptocurrencies</CardDescription>
                </CardHeader>
                <CardContent>
                    <SkeletonWrapper isLoading={isLoading}>
                        <FormCoin coins={coins} cryptos={cryptos} refetch={refetch}/>
                    </SkeletonWrapper>
                </CardContent>
            </Card>
        </div >
    )
}

export default function Donation() {
    const { data: cryptos, isLoading, refetch } = useQuery({
        queryKey: ['cryptos'],
        queryFn: fetchCrypto,
        refetchInterval: 10000
    })
    return (
        <CoinList cryptos={cryptos} isLoading={isLoading} refetch={refetch} />
    )
}