"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode, useState } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { wagmiAdapter, projectId } from '@/lib/reown/config'
import { createAppKit } from '@reown/appkit/react'
import { 
    mainnet, 
    arbitrum, 
    avalanche, 
    base, 
    optimism, 
    polygon,
    sepolia,
    gnosis,
    zkSync,
    zora,
    celo,
    aurora,
    baseSepolia,
    solana,
    solanaDevnet,
    solanaTestnet
} from '@reown/appkit/networks'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

if (!projectId) {
    throw new Error('Project ID is not defined')
}

const metadata = {
    name: 'charity',
    description: 'AppKit Example',
    url: 'https://reown.com/appkit',
    icons: ['https://assets.reown.com/reown-profile-pic.png']
}

createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [
        mainnet,
        arbitrum,
        avalanche,
        base,
        optimism,
        polygon,
        gnosis,
        zkSync,
        zora,
        celo,
        base,
        aurora,
        baseSepolia,
        solana,
        solanaDevnet,
        solanaTestnet,
        sepolia
    ],
    defaultNetwork: mainnet,
    metadata: metadata,
    features: {
        analytics: true,
    },
    themeVariables: {
        '--w3m-accent': '#10b981',
    }
})

interface Props {
    children: ReactNode;
    cookies: string | null
}

const Providers = ({ children, cookies }: Props) => {
    const [client] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                    },
                },
            })
    );

    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
            <QueryClientProvider client={client}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

export default Providers;