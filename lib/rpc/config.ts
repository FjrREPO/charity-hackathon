import { useState } from 'react';

class RPCRateLimiter {
    private queue: (() => Promise<any>)[] = [];
    private processing = false;
    private lastRequestTime = 0;
    private minRequestInterval = 1000;

    async addToQueue<T>(request: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await request();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });

            this.processQueue();
        });
    }

    private async processQueue() {
        if (this.processing || this.queue.length === 0) return;

        this.processing = true;

        while (this.queue.length > 0) {
            const now = Date.now();
            const timeToWait = Math.max(0, this.lastRequestTime + this.minRequestInterval - now);

            if (timeToWait > 0) {
                await new Promise(resolve => setTimeout(resolve, timeToWait));
            }

            const request = this.queue.shift();
            if (request) {
                this.lastRequestTime = Date.now();
                await request();
            }
        }

        this.processing = false;
    }
}

export function useRPCCall() {
    const [rateLimiter] = useState(() => new RPCRateLimiter());

    const makeRPCCall = async (params: any) => {
        return rateLimiter.addToQueue(async () => {
            const response = await fetch('https://rpc.walletconnect.org/v1/?chainId=eip155%3A1&projectId=YOUR_PROJECT_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: Date.now(),
                    method: 'eth_call',
                    params: params
                })
            });

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('Rate limit exceeded. Please try again later.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        });
    };

    return { makeRPCCall };
}