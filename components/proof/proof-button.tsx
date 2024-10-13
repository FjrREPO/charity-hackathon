import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useFormContext } from 'react-hook-form';
import { TableRHF } from '@/app/(client)/proof/_components/TableProof';

export const ProofButton = ({index }: { index: number }) => {
    const [isLoading, setIsLoading] = useState(false);

    const {
        getValues
    } = useFormContext<TableRHF>()

    const handleGenerateProof = async () => {
        const invoice = getValues(`invoices.${index}.value`)

        // console.log(invoice)
        
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
            console.log('Proof generated:', data);
            toast.success(`Proof generated successfully`);
        } catch (error) {
            console.error('Error generating proof:', error);
            toast.error('Failed to generate proof');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button onClick={handleGenerateProof} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Proof'}
        </Button>
    );
};