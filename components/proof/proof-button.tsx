
import DialogProof from '../tables/proof/DialogProof';
import { Button } from '../ui/button';

export const ProofButton = ({ productId, proveStatus }: { productId: number, proveStatus: boolean }) => {
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
                />
            )}
        </div>
    );
}