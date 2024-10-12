"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAccount } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ItemDetails } from './ItemDetails';
import { ConfirmationForm } from './ConfirmationForm';
import { AlertDialogTransaction } from './AlertDialogTransaction';
import { useERC20Balance } from '@/hooks/useERC20Balance';
import { USDC_ADDRESS } from '@/lib/abi/config';
import debounce from 'lodash.debounce';
import {
    useConnectModal,
} from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

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
    const { address } = useAccount();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [transactionHash, setTransactionHash] = useState<string | undefined>();
    const [isPending, setIsPending] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const { openConnectModal } = useConnectModal();

    const { balance, loading: balanceLoading } = useERC20Balance(address as HexAddress, USDC_ADDRESS);

    const debouncedSetLoading = useMemo(() => debounce((loading: boolean) => {
        setLoading(loading);
    }, 500), []);

    useEffect(() => {
        debouncedSetLoading(balanceLoading);
        return () => {
            debouncedSetLoading.cancel();
        };
    }, [balanceLoading, debouncedSetLoading]);

    const handleAlertClose = useCallback(() => {
        setIsAlertOpen(false);
        setTransactionHash(undefined);
        setIsDialogOpen(false);
    }, []);

    const handleSuccess = useCallback((hash: string) => {
        setIsConfirming(false);
        setTransactionHash(hash);
        setIsAlertOpen(true);
        setIsDialogOpen(false);
    }, []);

    return (
        <>
            {(isPending || isConfirming) && <LoadingScreen isOpen={isPending || isConfirming} isClosed={!isPending && !isConfirming} />}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {address ? (<DialogTrigger asChild>{trigger}</DialogTrigger>) :
                    (
                        <Button variant={"default"} className="flex flex-row gap-2" onClick={openConnectModal}>
                            <Image
                                src={item.coins?.image || ""}
                                alt={item.coins?.name || ""}
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                            <Label>
                                {item.price}
                            </Label>
                        </Button>
                    )
                }
                <DialogContent className="sm:max-w-[425px] max-w-[90vw] rounded-lg">
                    <AnimatePresence>
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={dialogVariants}
                            transition={{ duration: 0.3 }}
                        >
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-center pb-5">
                                    Item Details
                                </DialogTitle>
                            </DialogHeader>
                            <ItemDetails item={item} balance={balance} loading={isLoading} />
                            <ConfirmationForm
                                item={item}
                                balance={balance}
                                onPending={() => setIsPending(true)}
                                onConfirming={() => {
                                    setIsPending(false);
                                    setIsConfirming(true);
                                }}
                                onSuccess={handleSuccess}
                                onError={() => {
                                    setIsPending(false);
                                    setIsConfirming(false);
                                }}
                            />
                        </motion.div>
                    </AnimatePresence>
                </DialogContent>
            </Dialog>
            <AlertDialogTransaction
                isOpen={isAlertOpen}
                transactionHash={transactionHash || ''}
                onClose={handleAlertClose}
            />
        </>
    );
};