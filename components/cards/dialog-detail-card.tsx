"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { useAccount, useBalance, useWriteContract, useSimulateContract, useChainId } from 'wagmi';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { parseUnits } from 'viem';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useState } from 'react';
import { USDC_ABI, USDC_ADDRESS } from '@/lib/abi/config';

interface DialogDetailCardProps {
    trigger: React.ReactNode;
    item: Item;
}

export const DialogDetailCard = ({ trigger, item }: DialogDetailCardProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { address } = useAccount();
    const { data: balance } = useBalance({ address, token: USDC_ADDRESS });
    const chainId = useChainId();
    const recipientAddress = '0x979c193De8dFFc867611393fFd966861B6fB8836';

    const form = useForm({
        defaultValues: {
            confirmed: false,
        },
    });

    const { writeContract } = useWriteContract();

    const { data: simulateData } = useSimulateContract({
        chainId: chainId,
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [recipientAddress, parseUnits(item.price.toString(), 6).toString()]
    });

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            if (!simulateData?.request) {
                throw new Error('Simulation data is not ready');
            }
            await writeContract({
                ...simulateData.request,
                args: simulateData.request.args?.map(arg =>
                    typeof arg === 'bigint' ? arg.toString() : arg
                ),
            });
            toast.success(`Redirecting to signer sender...`);
        } catch (error) {
            console.error('Error submitting transaction:', error);
            toast.error('Failed to buy item');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-center">Detail</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="flex flex-col w-full gap-5">
                            <div className="w-full h-auto relative flex justify-center">
                                <img
                                    src={item.image || "/api/placeholder/200/200"}
                                    alt={item.name || "Item image"}
                                    className="rounded-lg w-full h-[100px] object-cover"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="grid grid-cols-[90px_1fr] gap-2 items-center">
                                    <Label className="font-bold text-sm">Item Name</Label>
                                    <Label className="text-md font-bold text-right line-clamp-1">{item.name}</Label>
                                </div>
                                <div className="grid grid-cols-[90px_1fr] gap-2 items-center">
                                    <Label className="font-bold text-sm">Price</Label>
                                    <Label className="text-md font-bold text-right line-clamp-1">
                                        {item.price}&nbsp;USDC
                                    </Label>
                                </div>
                                <div className="grid grid-cols-[90px_1fr] gap-2 items-center">
                                    <Label className="font-bold text-sm">Your Balance</Label>
                                    <Label className="text-md font-bold text-right line-clamp-1">
                                        {balance?.formatted || '0'}&nbsp;USDC
                                    </Label>
                                </div>
                            </div>
                            <Separator />
                            <FormField
                                control={form.control}
                                name="confirmed"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <input
                                                type="checkbox"
                                                checked={field.value}
                                                onChange={field.onChange}
                                                className="accent-primary"
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Confirm purchase</FormLabel>
                                            <FormDescription>
                                                I understand this action cannot be undone
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={isLoading || !form.watch('confirmed') || !simulateData?.request}
                            >
                                {isLoading ? 'Processing...' : 'Buy Now'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};