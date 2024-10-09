"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ColumnHeader";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export type TransactionHistoryRow = TransactionTransferHistory;

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.success('Copied to clipboard!')
  }).catch(err => {
    toast.error(`Failed to copy to clipboard! ${err}`)
  });
};

export const columns: ColumnDef<TransactionHistoryRow>[] = [
  {
    accessorKey: "blockNum",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Block Number"
      />
    ),
    cell: ({ row }) => <div>{row.original.blockNum}</div>,
  },
  {
    accessorKey: "hash",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Transaction Hash"
      />
    ),
    cell: ({ row }) => (
      <div className="flex items-center truncate w-full justify-between">
        <span className="mr-2">{row.original.hash}</span>
        <button
          onClick={() => copyToClipboard(row.original.hash)}
          aria-label="Copy to clipboard"
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <Copy size={16} />
        </button>
      </div>
    ),
  },
  {
    accessorKey: "from",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Sender"
      />
    ),
    cell: ({ row }) => <div>{row.original.from}</div>,
  },
  {
    accessorKey: "to",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Receiver"
      />
    ),
    cell: ({ row }) => <div>{row.original.to}</div>,
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Transaction Value"
      />
    ),
    cell: ({ row }) => (
      <p className="text-sm rounded-lg bg-gray-400/5 p-2 text-center font-medium">
        {row.original.value}
      </p>
    ),
  },
];
