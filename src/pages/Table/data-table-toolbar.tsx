/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { isAvailableStatuses, isEmailVerifiedStatuses } from "./data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    placeHolder?: string
    refetchData?: any;
    searchQuery?: string;
    setSearchQuery?: React.Dispatch<React.SetStateAction<string>>
}

export function DataTableToolbar<TData>({
    table,
    placeHolder,
    searchQuery,
    setSearchQuery,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters?.length > 0

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <div className="relative">
                    <Input
                        placeholder={placeHolder || "Search..."}
                        onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                        value={searchQuery}
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                    {searchQuery &&
                        <div className="hover:bg-gray-300 p-1 rounded-full absolute right-0 top-1/2 -translate-1/2" onClick={() => setSearchQuery && setSearchQuery("")}>
                            <X width={15} height={15} />
                        </div>
                    }
                </div>

                {table?.getAllLeafColumns()
                    .findIndex(col => col?.id === "isEmailVerified") > -1 && (
                        <DataTableFacetedFilter
                            column={table.getColumn("isEmailVerified")}
                            title="Verification Status"
                            options={isEmailVerifiedStatuses}
                        />
                    )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X />
                    </Button>
                )}
            </div>
        </div>
    )
}