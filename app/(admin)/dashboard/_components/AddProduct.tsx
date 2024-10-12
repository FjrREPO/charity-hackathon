"use client"

import React, { useCallback, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { toast } from 'sonner'
import donationABI from '@/lib/abi/donationABI.json'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertAddProduct } from './AlertAddProduct'
import { MAIN_ADDRESS } from '@/lib/abi/config'
import { LoadingScreen } from '@/components/LoadingScreen'

interface FormValues {
    id: number
    price: number
    confirmed: boolean
}

export default function AddProduct() {
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [transactionHash, setTransactionHash] = useState<`0x${string}` | undefined>();

    const form = useForm<FormValues>({
        defaultValues: {
            id: 0,
            price: 0,
            confirmed: false,
        },
    })

    const {
        data: hash,
        isPending,
        writeContract
    } = useWriteContract()

    const { isLoading: isConfirmationLoading, isSuccess: isConfirmationSuccess } = useWaitForTransactionReceipt({
        hash: transactionHash,
    })
    
    const handleAlertClose = useCallback(() => {
        setIsAlertOpen(false);
        setTransactionHash(undefined);
    }, []);

    const handleSuccess = useCallback((hash: `0x${string}`) => {
        setTransactionHash(hash);
        setIsAlertOpen(true);
    }, []);

    useEffect(() => {
        if (hash) {
            setTransactionHash(hash)
        }
    }, [hash])

    useEffect(() => {
        if (isConfirmationSuccess) {
            handleSuccess(transactionHash as `0x${string}`)
        }
    }, [isConfirmationSuccess, transactionHash, handleSuccess])

    const handleSubmit = useCallback((data: FormValues) => {
        if (!data.confirmed) {
            toast.error('Please confirm before submitting')
            return
        }

        try {
            writeContract({
                abi: donationABI,
                address: MAIN_ADDRESS,
                functionName: 'setProduct',
                args: [
                    BigInt(data.id),
                    BigInt(data.price)
                ],
            })
            toast.success('Transaction submitted. Waiting for confirmation...')
        } catch (error) {
            console.error('Create error:', error)
            toast.error('Create failed. Please try again.')
        }
    }, [writeContract])

    const isLoading = isPending || isConfirmationLoading

    return (
        <div>
            {(isLoading) && <LoadingScreen isOpen={isLoading} isClosed={isLoading} />}
            <div className="max-w-md mx-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                            control={form.control}
                            name="id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product ID</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                    </FormControl>
                                    <FormDescription>Enter the product ID</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                    </FormControl>
                                    <FormDescription>Enter the product price</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmed"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Confirm submission</FormLabel>
                                        <FormDescription>
                                            I confirm that I want to add this product
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending || isConfirmationLoading}>
                            {isPending ? 'Submitting...' : isConfirmationLoading ? 'Confirming...' : 'Add Product'}
                        </Button>
                    </form>
                </Form>
            </div>
            <AlertAddProduct
                isOpen={isAlertOpen}
                transactionHash={transactionHash || ''}
                onClose={handleAlertClose}
            />
        </div>
    )
}