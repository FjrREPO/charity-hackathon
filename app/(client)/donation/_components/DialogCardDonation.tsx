"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from '@/components/ui/dialog';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription
} from '@/components/ui/form';
import {
    useAccount,
    useBalance,
    useChainId,
    useWriteContract,
} from 'wagmi';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { USDC_ABI, USDC_ADDRESS } from '@/lib/abi/config';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { parseUnits } from 'viem';

interface DialogCardDonationProps {
    trigger: React.ReactNode;
    item: Item;
}

const dialogVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
};

export const DialogCardDonation: React.FC<DialogCardDonationProps> = ({ trigger, item }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { address } = useAccount();
    const chainId = useChainId();
    const { data: balance } = useBalance({ address, token: USDC_ADDRESS });

    const toAddress = "0x3B4f0135465d444a5bD06Ab90fC59B73916C85F5";

    const form = useForm({
        defaultValues: {
            confirmed: false,
        },
    });

    const { writeContract } = useWriteContract();

    const insufficientBalance = balance && parseFloat(balance.formatted) < item.price;

    const handleSubmit = async (data: { confirmed: boolean }) => {
        if (!data.confirmed || insufficientBalance) return;

        setIsLoading(true);

        const tx = await writeContract({
            chainId: chainId,
            abi: USDC_ABI,
            functionName: 'transfer',
            args: [toAddress, parseUnits(item.price.toString(), 6).toString()],
            address: USDC_ADDRESS,
        });

        if (tx !== undefined) {
            toast.success('Transaction successful!');
            setIsLoading(false);
        } else {
            toast.error('Transaction failed!');
            setIsLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-w-[90vw]">
                <AnimatePresence>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dialogVariants}
                        transition={{ duration: 0.3 }}
                    >
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-center pb-5">Detail</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                                <div className="flex flex-col w-full gap-3">
                                    <div className="w-full h-auto relative flex flex-col justify-center">
                                        <Image
                                            src={item.image || "/api/placeholder/200/200"}
                                            alt={item.name || "Item image"}
                                            className="rounded-lg w-full h-[100px] object-cover"
                                            height={200}
                                            width={200}
                                        />
                                        <DialogDescription className='text-sm relative text-right pt-1 text-gray-500'>
                                            Source: {item.source}
                                        </DialogDescription>
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
                                                        className="accent-primary cursor-pointer"
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel className='cursor-pointer'>Confirm purchase</FormLabel>
                                                    <FormDescription>
                                                        I understand this action cannot be undone
                                                    </FormDescription>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        disabled={isLoading || !form.watch('confirmed') || insufficientBalance}
                                    >
                                        {isLoading ? (
                                            <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#808080" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
                                            </svg>
                                        ) : 'Buy Now'}
                                    </Button>
                                    {insufficientBalance && (
                                        <Label className="text-red-500 text-sm font-medium">Insufficient balance to complete this purchase.</Label>
                                    )}
                                </div>
                            </form>
                        </Form>
                    </motion.div>
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
};