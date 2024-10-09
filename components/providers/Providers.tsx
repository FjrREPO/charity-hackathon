"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode, useState } from "react";
import { ThemeProvider } from "./ThemeProvider";
import { WagmiProvider } from 'wagmi'
import { config } from '@/lib/wagmi/config'
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { base } from "viem/chains";

interface Props {
    children: ReactNode;
}

const Providers = ({ children }: Props) => {
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

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={client}>
                <RainbowKitProvider modalSize="wide" initialChain={base} showRecentTransactions={true} coolMode>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

export default Providers;