"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { DataTableViewOptions } from "./ColumnToggle";
import { Button } from "../../ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  handleRefresh: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  handleRefresh
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      sorting,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 7,
      },
    },
  });

  const renderPaginationButtons = () => {
    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount();

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => (
        <Button
          key={index}
          variant={currentPage === index + 1 ? "secondary" : "outline"}
          size={"icon"}
          onClick={() => table.setPageIndex(index)}
        >
          {index + 1}
        </Button>
      ));
    } else {
      let start = currentPage - 2;
      let end = currentPage + 2;

      if (start < 1) {
        start = 1;
        end = 5;
      } else if (end > totalPages) {
        start = totalPages - 4;
        end = totalPages;
      }

      const visiblePages = Array.from({ length: end - start + 1 }, (_, index) => start + index);

      return visiblePages.map((page, index) => (
        <Button
          key={index}
          variant={page === currentPage ? "secondary" : "outline"}
          size={"icon"}
          onClick={() => table.setPageIndex(page - 1)}
        >
          {page}
        </Button>
      ));
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
        <div className="flex flex-wrap justify-between w-full items-center gap-2">
          <Button onClick={handleRefresh} variant={"outline"}>Refresh Table</Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Data not found, please connect wallet or make a transaction first.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col items-center justify-center py-4">
        <div className='flex flex-row items-center justify-center space-x-2 py-2'>
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon />
          </Button>
          {renderPaginationButtons()}
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon />
          </Button>
        </div>
        <Label>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </Label>
      </div>
    </>
  );
}