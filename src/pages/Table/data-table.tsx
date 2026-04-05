/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import BoxSpinLoader from "@/components/loaders/BoxSpinLoader"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[] | any
    pageNumber: number;
    setPageNumber: React.Dispatch<React.SetStateAction<number>>;
    totalPages?: number
    placeHolder?: string
    refetchData?: any
    loadingData?: boolean;
    searchQuery?: string;
    setSearchQuery?: React.Dispatch<React.SetStateAction<string>>
    onFilterChange?: (filters: any[]) => void;
    dateRange?: { from: Date | undefined; to?: Date | undefined }
    setDateRange?: (date: { from: Date | undefined; to?: Date | undefined } | undefined) => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageNumber,
    setPageNumber,
    totalPages,
    placeHolder,
    refetchData,
    loadingData = false,
    searchQuery,
    setSearchQuery,
    onFilterChange,
    dateRange,
    setDateRange,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [refetching, setRefetching] = React.useState<boolean>(false);

    const table = useReactTable({
        data,
        columns,
        state: {
            pagination: {
                pageIndex: pageNumber,
                pageSize: 20
            },
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        manualPagination: true,
        pageCount: totalPages || 1,
        onPaginationChange: (updaterOrValue) => {
            const value = typeof updaterOrValue === 'function'
                ? updaterOrValue({ pageIndex: pageNumber, pageSize: 20 })
                : updaterOrValue;
            console.log("value.pageIndex: ", value.pageIndex);
            setPageNumber(value.pageIndex);
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: (updaterOrValue) => {
            const nextFilters = typeof updaterOrValue === 'function' ? updaterOrValue(columnFilters) : updaterOrValue;
            setColumnFilters(nextFilters);
            onFilterChange?.(nextFilters);
        },
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    return (
        <div className="w-full space-y-2">
            <DataTableToolbar
                table={table}
                placeHolder={placeHolder || ''}
                refetchData={refetchData}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                refetching={refetching || loadingData}
                setRefetching={setRefetching}
                handleRefetchCall={refetchData}
                dateRange={dateRange}
                setDateRange={setDateRange}
            />
            <ScrollArea className="w-full border rounded-md">
                <div className="space-y-4 w-full min-w-[800px] pb-1">
                    <div>
                        <Table>
                            <TableHeader className="bg-white/40">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id} colSpan={header.colSpan}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            {(loadingData || refetching) ?
                                <TableCaption className="h-40 mt-0">
                                    <div className="w-full h-full flex justify-center items-center">
                                        <BoxSpinLoader />
                                    </div>
                                </TableCaption>
                                :
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
                                                colSpan={columns?.length}
                                                className="h-24 text-center"
                                            >
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            }
                        </Table>
                    </div>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <div className="w-full" style={{ pointerEvents: loadingData ? 'none' : 'all' }}>
                <DataTablePagination table={table} />
            </div>
        </div>
    )
}
