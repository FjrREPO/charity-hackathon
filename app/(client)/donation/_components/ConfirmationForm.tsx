"use client"

import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MAIN_ADDRESS, USDC_ADDRESS } from '@/lib/abi/config';
import { erc20Abi } from 'viem';
import donationABI from '@/lib/abi/donationABI.json';
import { 
    convertBigIntToNumber, 
} from '@/lib/utils';
import { toast } from 'sonner';

interface ConfirmationFormProps {
    item: Item;
    balance: bigint | undefined;
    onPending: () => void;
    onConfirming: () => void;
    onSuccess: (hash: string) => void;
    onError: () => void;
}

interface FormValues {
    confirmed: boolean;
}

export const ConfirmationForm: React.FC<ConfirmationFormProps> = ({
    item,
    balance,
    onPending,
    onConfirming,
    onSuccess,
    onError
}) => {
    const form = useForm<FormValues>();
    const { address } = useAccount();

    const {
        data: hash,
        isPending,
        writeContract
    } = useWriteContract();

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({
        hash
    });

    const { data: allowance } = useReadContract({
        abi: erc20Abi,
        address: USDC_ADDRESS,
        functionName: 'allowance',
        args: [
            address as `0x${string}`,
            MAIN_ADDRESS
        ],
    });

    const { data: price } = useReadContract({
        abi: donationABI,
        address: MAIN_ADDRESS,
        functionName: 'products',
        args: [item.id],
    });

    const insufficientBalance = useMemo(() =>
        balance !== undefined && convertBigIntToNumber(balance) < item.price,
        [balance, item.price]
    );

    const needsApproval = useMemo(() => 
        allowance !== undefined && price !== undefined && 
        convertBigIntToNumber(allowance) < convertBigIntToNumber(price as bigint),
        [allowance, price]
    );

    const handleSubmit = useCallback(async (data: FormValues) => {
        if (!data.confirmed || insufficientBalance) return;

        try {
            onPending();

            if (needsApproval) {
                await writeContract({
                    abi: erc20Abi,
                    address: USDC_ADDRESS,
                    functionName: 'approve',
                    args: [
                        MAIN_ADDRESS,
                        BigInt(10)
                    ],
                });

                await new Promise(resolve => setTimeout(resolve, 2000)); 
            }

            await writeContract({
                abi: donationABI,
                address: MAIN_ADDRESS,
                functionName: 'donate',
                args: [item.id],
            });

        } catch (error) {
            console.error('Transaction error:', error);
            onError();
            toast.error('Transaction failed. Please try again.');
        }
    }, [insufficientBalance, onPending, onError, item.id, writeContract, needsApproval]);

    React.useEffect(() => {
        if (isPending) onPending();
        if (isConfirming) onConfirming();
        if (isConfirmed && hash) onSuccess(hash);
    }, [isPending, isConfirming, isConfirmed, hash, onPending, onConfirming, onSuccess]);

    const isSubmitDisabled = useMemo(() =>
        isPending ||
        isConfirming ||
        insufficientBalance ||
        typeof allowance === 'undefined' ||
        typeof price === 'undefined',
        [isPending, isConfirming, insufficientBalance, allowance, price]
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="confirmed"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-3">
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
                    disabled={isSubmitDisabled}
                    className='w-full flex items-center'
                >
                    {isPending ? (
                        <span className="flex items-center">
                            {isConfirming ? 'Confirming...' : 'Processing...'}
                        </span>
                    ) : needsApproval ? (
                        'Approve & Donate'
                    ) : (
                        'Donate Now'
                    )}
                </Button>
                {insufficientBalance && (
                    <Label className="text-red-500 text-sm font-medium">
                        Insufficient balance to complete this purchase.
                    </Label>
                )}
            </form>
        </Form>
    );
};