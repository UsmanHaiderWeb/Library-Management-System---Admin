/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import React, { useRef } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { isEmailVerifiedStatuses } from "./data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    placeHolder?: string
    refetchData?: any
}

export function DataTableToolbar<TData>({
    table,
    placeHolder,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    // Debounce logic
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(() => {
            table.getColumn("name")?.setFilterValue(event.target.value);
            console.log("User stopped typing!")
        }, 2000) // 500ms debounce
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                {table.getAllLeafColumns()
                    .findIndex(col => col.id === "name") > -1 && (
                        <Input
                            placeholder={placeHolder || "Filter student name..."}
                            onChange={handleInputChange}
                            className="h-8 w-[150px] lg:w-[250px]"
                        />
                    )}

                {table.getAllLeafColumns()
                    .findIndex(col => col.id === "isEmailVerified") > -1 && (
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
