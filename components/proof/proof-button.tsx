
import DialogProof from './dialog-proof'
import { Button } from '../ui/button';


export const ProofButton = ({ productId, proveStatus, transactionId, handleRefresh }: { productId: number, proveStatus: boolean, transactionId: number, handleRefresh: () => void }) => {
    return (
        <div className='max-w-[150px] flex justify-center'>
            {proveStatus ? (
                <Button
                    disabled
                    variant="outline"
                    className="w-full"
                >
                    Already Proved
                </Button>
            ) : (
                <DialogProof
                    trigger={
                        <Button>
                            Generate Proof
                        </Button>
                    }
                    productId={productId}
                    transactionId={transactionId}
                    handleRefresh={handleRefresh}
                />
            )}
        </div>
    );
}