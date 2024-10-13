import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useFormContext } from 'react-hook-form';
import { TableRHF } from '@/app/(client)/proof/_components/TableProof';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import donationABI from '@/lib/abi/donationABI.json';
import { MAIN_ADDRESS } from '@/lib/abi/config';

export const ProofButton = ({index }: { index: number }) => {
    const [isLoading, setIsLoading] = useState(false);

    const {
        getValues
    } = useFormContext<TableRHF>()
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

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({ hash })

    const handleGenerateProof = async () => {
        const invoice = getValues(`invoices.${index}.value`)

        // console.log(invoice)
        
        if (!isConnected) {
            toast.error('Please connect your wallet first');
            return;
        }

        if (!idItem) {
            toast.error('Item ID is required');
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
                    BigInt(idItem),
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
            toast.success('Prove generated!');
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
        <Button
            onClick={handleGenerateProof}
            disabled={isLoading || isPending || isConfirming}
        >
            {buttonText}
        </Button>
    );
}