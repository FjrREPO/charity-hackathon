import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Check } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface AlertDialogTransactionProps {
    isOpen: boolean;
    transactionHash: string;
    onClose: () => void;
}

const AlertDialogTransactionComponent: React.FC<AlertDialogTransactionProps> = ({ isOpen, transactionHash, onClose }) => {
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                        <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <AlertDialogTitle className="text-center text-textSecondary">
                        Transaction Successful!
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        Your transaction has been processed successfully.
                        <div className="mt-2 text-sm text-gray-500">
                            Transaction Hash:
                            <br />
                            <Label className="font-mono break-all">{transactionHash}</Label>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={onClose}>Close</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export const AlertDialogTransaction = React.memo(AlertDialogTransactionComponent);
AlertDialogTransaction.displayName = 'AlertDialogTransaction';