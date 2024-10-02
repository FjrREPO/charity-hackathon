"use client"

import { useQuery } from '@tanstack/react-query'
import React from 'react'

export default function PriceCoin() {
    const fetchCoins = async (): Promise<any> => {
        const response = await fetch('/api/token')
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`)
        }
        return response.json()
    }

    const { data: coins, isError, error, isLoading } = useQuery({
        queryKey: ['coins'],
        queryFn: fetchCoins,
    })
    return (
        <div>
            <p>{coins}</p>
        </div>
    )
}
