"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ColumnHeader";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { convertTimestampToDate, formatAddress } from "@/lib/utils";
import { ProofButton } from "@/components/proof/proof-button";

export type TransactionHistoryRow = TransactionContract;

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.success('Copied to clipboard!')
  }).catch(err => {
    toast.error(`Failed to copy to clipboard! ${err}`)
  });
};

export const columns: ColumnDef<TransactionHistoryRow>[] = [
  {
    accessorKey: "productId",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Product ID"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm">
          {row.original.productId}
        </div>
      );
    },
  },
  {
    accessorKey: "timeStamp",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Timestamp"
      />
    ),
    cell: ({ row }) => <div>{convertTimestampToDate(row.original.timestamp)}</div>,
  },
  {
    accessorKey: "account",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Sender"
      />
    ),
    cell: ({ row }) => (
      <div className="flex items-center truncate w-fit justify-between">
        <span className="mr-2">{formatAddress(row.original.account as HexAddress)}</span>
        <button
          onClick={() => copyToClipboard(row.original.account as HexAddress)}
          aria-label="Copy to clipboard"
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <Copy size={16} />
        </button>
      </div>
    ),
  },
  {
    accessorKey: "marketplaceId",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Marketplace ID"
      />
    ),
    cell: ({ row }) => <div>{row.original.marketplaceId}</div>,
  },
  {
    accessorKey: "proved",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Proof Status"
      />
    ),
    cell: ({ row }) => (
      <p className="text-sm rounded-lg bg-gray-400/5 p-2 text-left font-medium">
        {row.original.proved ? "Proved" : "Not Proved"}
      </p>
    ),
  },
  {
    id: "generateProof",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Generate Proof"
      />
    ),
    cell: ({ row }) => {
      return (
        <div>
          <ProofButton idItem={row.original.productId} />
        </div>
      )
    },
  },
];