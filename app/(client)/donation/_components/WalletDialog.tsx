import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

const walletOptions = [
    { name: 'OKX Wallet', logo: 'https://ramps.normi.es/wallet/okx.svg', type: 'ethereum' },
    { name: 'WalletConnect', logo: 'https://ramps.normi.es/wallet/wallet-connect.svg', type: 'ethereum' },
    { name: 'Beacon', logo: 'https://ramps.normi.es/wallet/beacon.svg', type: 'tezos' },
    { name: 'Phantom', logo: 'https://res.cloudinary.com/dutlw7bko/image/upload/v1727932925/charity-hackathon/unnamed-hAq81XBBN-transformed_fdefs3.jpg', type: 'solana' },
    { name: 'OKX Wallet', logo: 'https://ramps.normi.es/wallet/okx.svg', type: 'solana' },
    { name: 'TON', logo: 'https://ramps.normi.es/wallet/ton.svg', type: 'ton' },
];

const WalletDialog = ({ isOpen, onClose, onConnect }: { isOpen: boolean, onClose: () => void, onConnect: (wallet: string) => void }) => {
    const groupedWallets = walletOptions.reduce((acc, wallet) => {
        if (!acc[wallet.type]) {
            acc[wallet.type] = [];
        }
        acc[wallet.type].push(wallet);
        return acc;
    }, {} as Record<string, typeof walletOptions>);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Connect to a wallet</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {Object.keys(groupedWallets).map(type => (
                        <div key={type}>
                            <h3 className="mb-2 capitalize">{type} wallet</h3>
                            <div className="flex flex-wrap gap-2">
                                {groupedWallets[type].map(wallet => (
                                    <Button
                                        key={wallet.name}
                                        variant={"default"}
                                        onClick={() => onConnect(wallet.name)}
                                        className="flex items-center justify-center p-2 "
                                    >
                                        <Image src={wallet.logo} alt={wallet.name} width={24} height={24} className="mr-2" />
                                        <span>{wallet.name}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-sm text-gray-400 mt-4">
                    By connecting a wallet, you agree to <a href="#" className="text-emerald-400">Terms and Conditions</a>
                </p>
            </DialogContent>
        </Dialog>
    );
};

export default WalletDialog;