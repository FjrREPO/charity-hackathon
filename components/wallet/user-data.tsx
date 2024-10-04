import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Label } from '@/components/ui/label';
import { ethers } from 'ethers';

interface Token {
    symbol: string;
    address: string | null;
    decimals: number;
}

const TOKENS: Token[] = [
    { symbol: 'ETH', address: null, decimals: 18 },
    {
        symbol: 'USDT',
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        decimals: 6
    },
    {
        symbol: 'WBTC',
        address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        decimals: 8
    }
];

const ERC20_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)'
];

export default function UserData() {
    const { address } = useAccount();
    const [balances, setBalances] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBalances = async () => {
            if (!address || !window.ethereum) return;

            setIsLoading(true);
            setError(null);

            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const balancePromises = TOKENS.map(async (token) => {
                    try {
                        if (!token.address) {
                            const balance = await provider.getBalance(address);
                            return [token.symbol, ethers.utils.formatEther(balance)];
                        } else {
                            const contract = new ethers.Contract(
                                token.address,
                                ERC20_ABI,
                                provider
                            );
                            const balance = await contract.balanceOf(address);
                            return [token.symbol, ethers.utils.formatUnits(balance, token.decimals)];
                        }
                    } catch (err) {
                        console.error(`Error fetching ${token.symbol} balance:`, err);
                        return [token.symbol, '0.00'];
                    }
                });

                const balanceResults = await Promise.all(balancePromises);
                const newBalances = Object.fromEntries(balanceResults);
                setBalances(newBalances);
            } catch (err) {
                console.error('Error fetching balances:', err);
                setError('Failed to fetch balances. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBalances();
    }, [address]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">User Data</h1>
            <Label className="block mb-4">
                Address: {address ? address : 'Not connected'}
            </Label>

            <h2 className="text-xl font-semibold mb-2">User Balances</h2>
            {isLoading ? (
                <p>Loading balances...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <ul className="space-y-2">
                    {TOKENS.map(token => (
                        <li key={token.symbol}>
                            <Label>{token.symbol}: {balances[token.symbol] || '0.00'}</Label>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}