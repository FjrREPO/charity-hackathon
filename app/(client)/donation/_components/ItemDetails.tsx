import React from 'react';
import Image from 'next/image';
import { DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';

interface ItemDetailsProps {
    item: Item;
    balance: bigint | undefined;
    loading: boolean;
}

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="grid grid-cols-[90px_1fr] gap-2 items-center">
        <Label className="font-bold text-sm">{label}</Label>
        <Label className="text-md font-bold text-right line-clamp-1">{value}</Label>
    </div>
);

export const ItemDetails: React.FC<ItemDetailsProps> = React.memo(({ item, balance, loading }) => (
    <div className="flex flex-col w-full gap-3">
        <div className="w-full h-auto relative flex flex-col justify-center">
            <Image
                src={item.image || "/api/placeholder/200/200"}
                alt={item.name}
                className="rounded-lg w-full h-[100px] object-cover"
                height={200}
                width={200}
            />
            <DialogDescription className='text-sm relative text-right pt-1 text-gray-500'>
                Source: {item.source}
            </DialogDescription>
        </div>
        <div className="flex flex-col gap-2">
            <DetailRow label="Item Name" value={item.name} />
            <DetailRow label="Price" value={`${item.price} USDC`} />
            {loading ? (
                <DetailRow label="Your Balance" value="Loading..." />
            ) : (
                <DetailRow label="Your Balance" value={balance !== undefined ? `${formatPrice(balance)} USDC` : '0'} />
            )}
        </div>
        <Separator />
    </div>
));