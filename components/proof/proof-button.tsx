import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const ProofButton = ({ idItem }: { idItem?: number }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateProof = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/proof', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ invoice: idItem?.toString() }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate proof');
            }

            const data = await response.json();
            toast.success(`Proof generated successfully`);
            console.log('proof = ', data.proofData);
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