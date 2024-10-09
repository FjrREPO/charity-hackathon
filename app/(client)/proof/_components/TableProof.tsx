"use client";

import { columns } from "@/components/tables/proof/columns";
import { DataTable } from "@/components/tables/proof/DataTable";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function TableProof() {
    const { address } = useAccount();
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const { data: transactionsHistory, isLoading, refetch } = useQuery<TransactionTransferHistory[]>({
        queryKey: ["transfer"],
        queryFn: () => fetch(`/api/user/transfer`).then((res) => res.json()),
        enabled: !!address,
        refetchInterval: 10000,
    });

    const handleRefresh = () => {
        if (!address) {
            toast.error('Please connect your wallet first');
            return;
        }
        refetch();
    };

    if (!hasMounted) {
        return null; 
    }

    return (
        <div className="w-full space-y-4 pt-[100px] p-5">
            <SkeletonWrapper isLoading={isLoading}>
                <DataTable
                    data={transactionsHistory || []}
                    columns={columns}
                    handleRefresh={handleRefresh}
                />
            </SkeletonWrapper>
        </div>
    );
}
