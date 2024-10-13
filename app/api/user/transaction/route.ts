import { MAIN_ADDRESS, USDC_ADDRESS } from "@/lib/abi/config";
import { NextResponse } from "next/server";

export async function GET() {
    const url = 'https://base-mainnet.g.alchemy.com/v2/vwDTCZX0XZnU6flxj8YzYZuMaOKI3EX9';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: 1,
            jsonrpc: "2.0",
            method: "alchemy_getAssetTransfers",
            params: [
                {
                    fromBlock: "0x0",
                    toBlock: "latest",
                    toAddress: MAIN_ADDRESS,
                    contractAddresses: [
                        USDC_ADDRESS
                    ],
                    category: [
                        "erc20"
                    ],
                    withMetadata: false,
                    excludeZeroValue: false,
                    maxCount: "0x3e8"
                },
            ],
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.message || 'API returned an error');
    }

    return NextResponse.json(data?.result?.transfers || []);
}
