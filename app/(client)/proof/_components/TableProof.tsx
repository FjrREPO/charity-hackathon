"use client";

import { columns } from "@/components/tables/proof/columns";
import { DataTable } from "@/components/tables/proof/DataTable";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export type TableRHF = {
    invoices: {
        value: string
    }[]
}

export default function TableProof() {
    const { address } = useAccount();
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const { data: transactionsHistory, isLoading, refetch, isRefetching } = useQuery<TransactionTransferHistory[]>({
        queryKey: ["transfer", address],
        queryFn: () => fetch(`/api/user/transfer?address=${address}`).then((res) => res.json()),
        enabled: !!address,
        refetchInterval: 60000,
    });

    const handleRefresh = () => {
        if (!address) {
            toast.error('Please connect your wallet first');
            return;
        }
        refetch();
    };

    const defaultValues: TableRHF = {
        invoices: transactionsHistory?.map(() => ({
            value: ""
        })) ?? []
    }

    const methods = useForm<TableRHF>(
        {
            defaultValues
        }
    )

    if (!hasMounted) {
        return null;
    }

    return (
        <FormProvider {...methods} >
            <div className="w-full space-y-4 pt-[100px] p-5">
                <DataTable
                    data={transactionsHistory || []}
                    columns={columns}
                    handleRefresh={handleRefresh}
                    isLoading={isLoading || isRefetching}
                />
            </div>
        </FormProvider>
    );
}
