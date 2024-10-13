"use client";

import { columns } from "@/components/tables/proof/columns";
import { DataTable } from "@/components/tables/proof/DataTable";
import { toast } from "sonner";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { useEffect, useState, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";

export type TableRHF = {
    invoices: {
        value: string
    }[]
}
import { MAIN_ADDRESS } from "@/lib/abi/config";
import donationABI from "@/lib/abi/donationABI.json";
import { Abi } from "viem";
import debounce from "lodash.debounce";

export default function TableProof() {
    const { address } = useAccount();
    const [hasMounted, setHasMounted] = useState(false);
    const [dataTransaction, setDataTransaction] = useState<TransactionContract[]>([]);
    const [currentTransactionId, setCurrentTransactionId] = useState<number | null>(null);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const contracts = useMemo(() => {
        if (currentTransactionId === null) return [];
        return Array.from({ length: currentTransactionId }, (_, i) => ({
            address: MAIN_ADDRESS as HexAddress,
            abi: donationABI as Abi,
            functionName: "donations",
            args: [BigInt(i + 1)]
        }));
    }, [currentTransactionId]);

    const { data: contractData, isLoading: loadingContracts, refetch, isRefetching } = useReadContracts({
        contracts,
        query: {
            refetchInterval: 120000,
            enabled: currentTransactionId !== null,
        }
    });

    const handleRefresh = debounce(() => {
        if (!address) {
            toast.error('Please connect your wallet first');
            return;
        }
        refetch();
    }, 300);

    const { data: transactionId } = useReadContract({
        abi: donationABI,
        functionName: 'currentTransactionId',
        address: MAIN_ADDRESS as HexAddress
    });

    useEffect(() => {
        if (transactionId) {
            setCurrentTransactionId(Number(transactionId));
        }
    }, [transactionId]);

    useEffect(() => {
        if (contractData) {
            const transactionContracts = contractData.map((item,i) => {
                if (item.status === "success" && item.result) {
                    const [account, productId, timestamp, marketplaceId, proved, link] = item.result as [string, number, number, number, boolean, string];
                    return {
                        account,
                        productId: Number(productId),
                        timestamp: Number(timestamp),
                        marketplaceId: Number(marketplaceId),
                        proved,
                        link,
                        transactionId: Number(i + 1),
                    };
                } else {
                    return null;
                }
            }).filter((item): item is TransactionContract => item !== null);
            setDataTransaction(transactionContracts);
        }
    }, [contractData]);

    const defaultValues: TableRHF = {
        invoices: dataTransaction?.map(() => ({
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
            <div className="w-full space-y-4 pt-[120px] p-5">
                <DataTable
                    data={dataTransaction}
                    columns={columns(handleRefresh)}
                    handleRefresh={handleRefresh}
                    isLoading={isRefetching || loadingContracts}
                />
            </div>
        </FormProvider>
    );
}