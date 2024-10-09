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
                            <LoadingSpinner />
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

const LoadingSpinner = () => (
    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#808080" />
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2" />
    </svg>
);