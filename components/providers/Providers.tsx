"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode, useState } from "react";
import { ThemeProvider } from "./ThemeProvider";

interface Props {
    children: ReactNode;
}

const Providers = (props: Props) => {
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
        <QueryClientProvider client={client}>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                disableTransitionOnChange
            >
                {props.children}
            </ThemeProvider>
        </QueryClientProvider>
    )
};

export default Providers;
