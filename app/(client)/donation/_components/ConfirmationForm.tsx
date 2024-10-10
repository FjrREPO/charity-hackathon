import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { USDC_ADDRESS, RECIPIENT_ADDRESS } from '@/lib/abi/config';
import { erc20Abi } from 'viem';

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

    const insufficientBalance = useMemo(() =>
        balance !== undefined && parseInt(balance.toString())/1000000 < item.price,
        [balance, item.price]
    );

    const handleSubmit = useCallback((data: FormValues) => {
        if (!data.confirmed || insufficientBalance) return;

        try {
            onPending();
            writeContract({
                abi: erc20Abi,
                address: USDC_ADDRESS,
                functionName: 'transfer',
                args: [
                    RECIPIENT_ADDRESS,
                    BigInt(item.price),
                ],
            });
        } catch (error) {
            console.error('Transaction error:', error);
            onError();
        }
    }, [insufficientBalance, writeContract, item.price, onPending, onError]);

    React.useEffect(() => {
        if (isPending) onPending();
        if (isConfirming) onConfirming();
        if (isConfirmed && hash) onSuccess(hash);
    }, [isPending, isConfirming, isConfirmed, hash, onPending, onConfirming, onSuccess]);

    const isSubmitDisabled = useMemo(() =>
        isPending || insufficientBalance,
        [isPending, form, insufficientBalance]
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
                    ) : (
                        'Buy Now'
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