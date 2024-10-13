import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import items from "@/data/items/items.json";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import donationABI from '@/lib/abi/donationABI.json';
import { MAIN_ADDRESS } from '@/lib/abi/config';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function DialogProof({ trigger, productId }: { trigger: React.ReactNode, productId: number }) {
    const item = items.find((item: Item) => item.id === productId);

    const [isLoading, setIsLoading] = useState(false);
    const [invoice, setInvoice] = useState<number>(0);
    const [isOpen, setIsOpen] = useState(false);

    const { isConnected } = useAccount();

    const { data: currentTransactionId } = useReadContract({
        address: MAIN_ADDRESS as HexAddress,
        abi: donationABI,
        functionName: "currentTransactionId",
    });

    const {
        writeContract,
        data: hash,
        isPending
    } = useWriteContract()

    const { data: hasClaimed } = useReadContract({
        address: MAIN_ADDRESS as HexAddress,
        abi: donationABI,
        functionName: "hasClaimed",
        args: [BigInt(invoice)],
    })

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({ hash })

    const handleGenerateProof = async () => {
        if(hasClaimed == true) {
            toast.error('Invoice already claimed!');
            return
        }

        if (!isConnected) {
            toast.error('Please connect your wallet first');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/proof', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ invoice: invoice }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate proof');
            }

            const data = await response.json();

            if (!writeContract) {
                throw new Error('Write contract function is not available');
            }

            if (!currentTransactionId) {
                throw new Error('Current transaction ID is not available');
            }

            writeContract({
                abi: donationABI,
                address: MAIN_ADDRESS,
                functionName: 'proveDonation',
                args: [
                    BigInt(currentTransactionId as number),
                    BigInt(invoice),
                    data.proofData
                ],
            })
        } catch (error) {
            console.error('Error generating proof:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to generate proof');
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        if (isConfirmed) {
            toast.success('Proof generated!');
            setIsOpen(false);
        }
    }, [isConfirmed]);

    const buttonText = isLoading ? 'Generating...' :
        isPending ? 'Confirming...' :
            isConfirming ? 'Confirming...' :
                'Generate Proof';

    if (!isConnected) {
        return <Button disabled>Connect Wallet to Generate Proof</Button>;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger onClick={() => setIsOpen(true)}>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-w-[90vw] rounded-lg">
                <DialogHeader>
                    <DialogTitle>Generate Proof</DialogTitle>
                </DialogHeader>
                {item && (
                    <div className="flex flex-col w-full gap-3">
                        <div className="w-full h-auto relative flex flex-col justify-center">
                            <Image
                                src={item.image || "/api/placeholder/200/200"}
                                alt={item.name}
                                className="rounded-lg w-full h-[100px] object-cover"
                                height={200}
                                width={200}
                            />
                            <DialogDescription className='text-sm relative text-right pt-1 text-gray-500'>
                                Source: {item.source}
                            </DialogDescription>
                        </div>
                        <div className="flex flex-col gap-2">
                            <DetailRow label="Item Name" value={item.name} />
                            <DetailRow label="Reward" value={`0,1 USDC`} />
                        </div>
                        <Separator />
                    </div>
                )}
                <Input placeholder="Invoice" type='number' onChange={(e) => setInvoice(Number(e.target.value))} />
                <Button
                    onClick={handleGenerateProof}
                    disabled={isLoading || isPending || isConfirming}
                >
                    {buttonText}
                </Button>
            </DialogContent>
        </Dialog>
    )
}

const DetailRow: React.FC<{ label: string; value: string }> = function DetailRow({ label, value }) {
    return (
        <div className="grid grid-cols-[90px_1fr] gap-2 items-center">
            <Label className="font-bold text-sm">{label}</Label>
            <Label className="text-md font-bold text-right line-clamp-1">{value}</Label>
        </div>
    );
};