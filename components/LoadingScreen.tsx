import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

const loadingVariants = {
    animate: {
        rotate: 360,
        transition: {
            repeat: Infinity,
            duration: 1,
            ease: "linear"
        }
    }
};

export const LoadingScreen = ({ isOpen, isClosed }: { isOpen: boolean, isClosed: boolean }) => (
    <>
        {isClosed == false &&
            <Dialog open={isOpen}>
                <DialogContent className="sm:max-w-[425px] max-w-[90vw] rounded-lg flex items-center justify-center z-50">
                    <div className="text-center">
                        <motion.div
                            animate="animate"
                            variants={loadingVariants}
                            className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full mx-auto mb-4"
                        />
                        <h2 className="text-xl font-semibold mb-2">Processing Transaction</h2>
                        <p className="text-gray-600">Please wait while we process your transaction...</p>
                    </div>
                </DialogContent>
            </Dialog>
        }
    </>
);