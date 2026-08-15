/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Table } from "@tanstack/react-table"
import { RefreshCcw, X } from "lucide-react"
import React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { isEmailVerifiedStatuses } from "./data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"

const userRoles = [
    { value: "STUDENT", label: "Student" },
    { value: "FACULTY", label: "Faculty" },
    { value: "STAFF", label: "Staff" },
    { value: "ADMIN", label: "Admin" },
];


interface DataTableToolbarProps<TData> {
    table: Table<TData>
    placeHolder?: string
    refetchData?: any;
    searchQuery?: string;
    setSearchQuery?: React.Dispatch<React.SetStateAction<string>>
    refetching?: boolean
    setRefetching?: React.Dispatch<React.SetStateAction<boolean>>
    handleRefetchCall?: any
    dateRange?: DateRange
    setDateRange?: (date: DateRange | undefined) => void
}

export function DataTableToolbar<TData>({
    table,
    placeHolder,
    searchQuery,
    setSearchQuery,
    refetching,
    setRefetching,
    handleRefetchCall,
    dateRange,
    setDateRange,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters?.length > 0

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <div data-tour="table-search" className="relative">
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
                {table?.getAllLeafColumns()
                    .findIndex(col => col?.id === "role") > -1 && (
                        <DataTableFacetedFilter
                            column={table.getColumn("role")}
                            title="Role"
                            options={userRoles}
                        />
                    )}

                {setDateRange && (
                    <DatePickerWithRange date={dateRange} setDate={setDateRange} />
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
            {(handleRefetchCall && setRefetching) &&
                <div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="secondary" size='sm' disabled={refetching}
                                    onClick={async () => {
                                        setRefetching(true);
                                        await handleRefetchCall();
                                        setRefetching(false);
                                    }}
                                >
                                    <RefreshCcw size={15} className={refetching ? `animate-spin duration-300` : ''} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Refresh</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            }
        </div>
    )
}