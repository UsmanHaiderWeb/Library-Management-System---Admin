/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "./data-table-column-header"
import { AllBorrowedBooksTableInterface, AllBorrowRequestsTableInterface, BookInterface, UserInfoType } from "@/lib/types&interfaces"
import DenyAccountRequest from "@/components/DenyAccountRequest"
import ApproveAccountRequest from "@/components/ApproveAccountRequest"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { AlertDialogCancel, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogContent, AlertDialogDescription, AlertDialog } from "@/components/ui/alert-dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, X } from "lucide-react"
import { api } from "@/lib/AxiosCalls"
import { useLocation } from "react-router-dom"
import { format } from "date-fns";


export const bookTableColumns: ColumnDef<BookInterface>[] = [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //       className="translate-y-[2px]"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //       className="translate-y-[2px]"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
        id: "id",
        header: () => "Sr.",
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: () => "Book Number",
        cell: ({ row }) => <div>{row?.original.bookNumber}</div>,
    },
    {
        accessorKey: "bookName",
        header: () => "Book Name",
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[250px] truncate font-medium">
                        {row.getValue("bookName")}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "author",
        header: () => "Author",
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[250px] truncate font-medium">
                        {row.getValue("author")}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "genre",
        header: () => "Genre",
        cell: ({ row }) => {
            return (
                <div className="max-w-[120px] truncate">
                    <span>{row.getValue("genre")}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "isAvailable",
        header: () => "Available",
        cell: ({ row }) => {
            const isAvailable = row?.original?._count?.copies > 0;
            return (
                <div className="flex space-x-2">
                    <Badge variant="outline" className={isAvailable ? 'bg-[#ECFDF3] text-green-700' : `bg-pink-50 text-pink-700`}>{isAvailable ? "Available" : "Not Available"}</Badge>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "almirahNumber",
        header: () => "Almirah",
        cell: ({ row }) => {
            return (
                <div className="w-[50px] text-center">
                    <span>{row?.original?.almirahNumber}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "shelfNumber",
        header: () => "Shelf",
        cell: ({ row }) => {
            return (
                <div className="w-[40px] text-center">
                    <span>{row?.original?.shelfNumber}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "totalBooks",
        header: () => <span className="text-center">Total Books</span>,
        cell: ({ row }) => {
            return (
                <div className="text-center">
                    <span>{row?.original?.totalBooks}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "borrowedBooks",
        header: () => <span className="text-center">Borrowed Books</span>,
        cell: ({ row }) => {
            return (
                <div className="text-center">
                    <span>{row?.original?.totalBooks - row?.original?._count?.copies}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: () => "Added On",
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span>{row?.original?.createdAt ? new Date(row?.original?.createdAt).toLocaleDateString('en-GB') : 'N/A'}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "actions`",
        header: () => "Actions",
        cell: () => {
            return (
                <div className="flex items-center gap-3">
                    <div>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.61666 16.2666C4.10832 16.2666 3.63332 16.0916 3.29166 15.7666C2.85832 15.3583 2.64999 14.7416 2.72499 14.075L3.03332 11.375C3.09166 10.8666 3.39999 10.1916 3.75832 9.82496L10.6 2.58329C12.3083 0.774959 14.0917 0.72496 15.9 2.43329C17.7083 4.14163 17.7583 5.92496 16.05 7.73329L9.20832 14.975C8.85832 15.35 8.20832 15.7 7.69999 15.7833L5.01666 16.2416C4.87499 16.25 4.74999 16.2666 4.61666 16.2666ZM13.275 2.42496C12.6333 2.42496 12.075 2.82496 11.5083 3.42496L4.66666 10.675C4.49999 10.85 4.30832 11.2666 4.27499 11.5083L3.96666 14.2083C3.93332 14.4833 3.99999 14.7083 4.14999 14.85C4.29999 14.9916 4.52499 15.0416 4.79999 15L7.48332 14.5416C7.72499 14.5 8.12499 14.2833 8.29166 14.1083L15.1333 6.86663C16.1667 5.76663 16.5417 4.74996 15.0333 3.33329C14.3667 2.69163 13.7917 2.42496 13.275 2.42496Z" fill="#0089F1" />
                            <path d="M14.4497 9.12504C14.433 9.12504 14.408 9.12504 14.3914 9.12504C11.7914 8.8667 9.69971 6.8917 9.29971 4.30837C9.24971 3.9667 9.48305 3.65004 9.82471 3.5917C10.1664 3.5417 10.483 3.77504 10.5414 4.1167C10.858 6.13337 12.4914 7.68337 14.5247 7.88337C14.8664 7.9167 15.1164 8.22504 15.083 8.5667C15.0414 8.88337 14.7664 9.12504 14.4497 9.12504Z" fill="#0089F1" />
                            <path d="M17.5 18.9583H2.5C2.15833 18.9583 1.875 18.6749 1.875 18.3333C1.875 17.9916 2.15833 17.7083 2.5 17.7083H17.5C17.8417 17.7083 18.125 17.9916 18.125 18.3333C18.125 18.6749 17.8417 18.9583 17.5 18.9583Z" fill="#0089F1" />
                        </svg>
                    </div>
                    <div>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.5001 5.60839C17.4834 5.60839 17.4584 5.60839 17.4334 5.60839C13.0251 5.16673 8.62505 5.00006 4.26672 5.44173L2.56672 5.60839C2.21672 5.64173 1.90839 5.39173 1.87505 5.04173C1.84172 4.69173 2.09172 4.39173 2.43339 4.35839L4.13339 4.19173C8.56672 3.74173 13.0584 3.91673 17.5584 4.35839C17.9001 4.39173 18.1501 4.70006 18.1167 5.04173C18.0917 5.36673 17.8167 5.60839 17.5001 5.60839Z" fill="#EF3A4B" />
                            <path d="M7.08363 4.76675C7.05029 4.76675 7.01696 4.76675 6.97529 4.75842C6.64196 4.70008 6.40863 4.37508 6.46696 4.04175L6.65029 2.95008C6.78363 2.15008 6.96696 1.04175 8.90863 1.04175H11.092C13.042 1.04175 13.2253 2.19175 13.3503 2.95841L13.5336 4.04175C13.592 4.38341 13.3586 4.70842 13.0253 4.75842C12.6836 4.81675 12.3586 4.58342 12.3086 4.25008L12.1253 3.16675C12.0086 2.44175 11.9836 2.30008 11.1003 2.30008H8.91696C8.03363 2.30008 8.01696 2.41675 7.89196 3.15841L7.70029 4.24175C7.65029 4.55008 7.38363 4.76675 7.08363 4.76675Z" fill="#EF3A4B" />
                            <path d="M12.675 18.9584H7.325C4.41666 18.9584 4.3 17.3501 4.20833 16.0501L3.66666 7.6584C3.64166 7.31673 3.90833 7.01673 4.25 6.99173C4.6 6.97506 4.89166 7.2334 4.91666 7.57506L5.45833 15.9667C5.55 17.2334 5.58333 17.7084 7.325 17.7084H12.675C14.425 17.7084 14.4583 17.2334 14.5417 15.9667L15.0833 7.57506C15.1083 7.2334 15.4083 6.97506 15.75 6.99173C16.0917 7.01673 16.3583 7.3084 16.3333 7.6584L15.7917 16.0501C15.7 17.3501 15.5833 18.9584 12.675 18.9584Z" fill="#EF3A4B" />
                            <path d="M11.3834 14.375H8.6084C8.26673 14.375 7.9834 14.0917 7.9834 13.75C7.9834 13.4083 8.26673 13.125 8.6084 13.125H11.3834C11.7251 13.125 12.0084 13.4083 12.0084 13.75C12.0084 14.0917 11.7251 14.375 11.3834 14.375Z" fill="#EF3A4B" />
                            <path d="M12.0837 11.0417H7.91699C7.57533 11.0417 7.29199 10.7584 7.29199 10.4167C7.29199 10.0751 7.57533 9.79175 7.91699 9.79175H12.0837C12.4253 9.79175 12.7087 10.0751 12.7087 10.4167C12.7087 10.7584 12.4253 11.0417 12.0837 11.0417Z" fill="#EF3A4B" />
                        </svg>
                    </div>
                </div>
            )
        },
    },
]

export const userColumn: ColumnDef<UserInfoType & { _count: { borrowedBooks: 0, borrowedRequests: 0 } }>[] = [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //       className="translate-y-[2px]"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //       className="translate-y-[2px]"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },

    {
        id: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Sr." />
        ),
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "studentId",
        header: () => "Student ID",
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[350px] truncate font-medium">
                        {row.getValue("studentId")}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Student Name" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[350px] truncate font-medium">
                        {row.getValue("name")}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "isEmailVerified",
        header: () => "Verification Status",
        cell: ({ row }) => {
            const isEmailVerified = row?.original?.isEmailVerified || '';
            return (
                <div className="flex space-x-2 justify-end">
                    <Badge variant="outline" className={isEmailVerified ? 'bg-[#ECFDF3] text-green-700' : `bg-pink-50 text-pink-700`}>{row?.original?.isEmailVerified ? "Verified User" : "Not Verified"}</Badge>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "email",
        header: () => "Email",
        cell: ({ row }) => {
            return (
                <div className="w-[150px] truncate">
                    <span>{row.getValue("email")}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "phoneNumber",
        header: () => "Phone Number",
        cell: ({ row }) => {
            return (
                <div className="w-[150px] truncate">
                    {row.getValue("phoneNumber") ?
                        <span>{row.getValue("phoneNumber")}</span>
                        :
                        <span className="opacity-60">not provided</span>
                    }
                </div>
            )
        },
    },
    {
        accessorKey: "borrowedBooks",
        header: () => "Borrowed Books",
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span>{row?.original?._count?.borrowedBooks || "N/A"}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: () => "Joined On",
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span>{row?.original?.createdAt ? new Date(row?.original?.createdAt).toLocaleDateString('en-GB') : 'N/A'}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "actions`",
        header: () => "Actions",
        cell: () => {
            return (
                <div className="flex items-center gap-3">
                    <div>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.61666 16.2666C4.10832 16.2666 3.63332 16.0916 3.29166 15.7666C2.85832 15.3583 2.64999 14.7416 2.72499 14.075L3.03332 11.375C3.09166 10.8666 3.39999 10.1916 3.75832 9.82496L10.6 2.58329C12.3083 0.774959 14.0917 0.72496 15.9 2.43329C17.7083 4.14163 17.7583 5.92496 16.05 7.73329L9.20832 14.975C8.85832 15.35 8.20832 15.7 7.69999 15.7833L5.01666 16.2416C4.87499 16.25 4.74999 16.2666 4.61666 16.2666ZM13.275 2.42496C12.6333 2.42496 12.075 2.82496 11.5083 3.42496L4.66666 10.675C4.49999 10.85 4.30832 11.2666 4.27499 11.5083L3.96666 14.2083C3.93332 14.4833 3.99999 14.7083 4.14999 14.85C4.29999 14.9916 4.52499 15.0416 4.79999 15L7.48332 14.5416C7.72499 14.5 8.12499 14.2833 8.29166 14.1083L15.1333 6.86663C16.1667 5.76663 16.5417 4.74996 15.0333 3.33329C14.3667 2.69163 13.7917 2.42496 13.275 2.42496Z" fill="#0089F1" />
                            <path d="M14.4497 9.12504C14.433 9.12504 14.408 9.12504 14.3914 9.12504C11.7914 8.8667 9.69971 6.8917 9.29971 4.30837C9.24971 3.9667 9.48305 3.65004 9.82471 3.5917C10.1664 3.5417 10.483 3.77504 10.5414 4.1167C10.858 6.13337 12.4914 7.68337 14.5247 7.88337C14.8664 7.9167 15.1164 8.22504 15.083 8.5667C15.0414 8.88337 14.7664 9.12504 14.4497 9.12504Z" fill="#0089F1" />
                            <path d="M17.5 18.9583H2.5C2.15833 18.9583 1.875 18.6749 1.875 18.3333C1.875 17.9916 2.15833 17.7083 2.5 17.7083H17.5C17.8417 17.7083 18.125 17.9916 18.125 18.3333C18.125 18.6749 17.8417 18.9583 17.5 18.9583Z" fill="#0089F1" />
                        </svg>
                    </div>
                    <div>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.5001 5.60839C17.4834 5.60839 17.4584 5.60839 17.4334 5.60839C13.0251 5.16673 8.62505 5.00006 4.26672 5.44173L2.56672 5.60839C2.21672 5.64173 1.90839 5.39173 1.87505 5.04173C1.84172 4.69173 2.09172 4.39173 2.43339 4.35839L4.13339 4.19173C8.56672 3.74173 13.0584 3.91673 17.5584 4.35839C17.9001 4.39173 18.1501 4.70006 18.1167 5.04173C18.0917 5.36673 17.8167 5.60839 17.5001 5.60839Z" fill="#EF3A4B" />
                            <path d="M7.08363 4.76675C7.05029 4.76675 7.01696 4.76675 6.97529 4.75842C6.64196 4.70008 6.40863 4.37508 6.46696 4.04175L6.65029 2.95008C6.78363 2.15008 6.96696 1.04175 8.90863 1.04175H11.092C13.042 1.04175 13.2253 2.19175 13.3503 2.95841L13.5336 4.04175C13.592 4.38341 13.3586 4.70842 13.0253 4.75842C12.6836 4.81675 12.3586 4.58342 12.3086 4.25008L12.1253 3.16675C12.0086 2.44175 11.9836 2.30008 11.1003 2.30008H8.91696C8.03363 2.30008 8.01696 2.41675 7.89196 3.15841L7.70029 4.24175C7.65029 4.55008 7.38363 4.76675 7.08363 4.76675Z" fill="#EF3A4B" />
                            <path d="M12.675 18.9584H7.325C4.41666 18.9584 4.3 17.3501 4.20833 16.0501L3.66666 7.6584C3.64166 7.31673 3.90833 7.01673 4.25 6.99173C4.6 6.97506 4.89166 7.2334 4.91666 7.57506L5.45833 15.9667C5.55 17.2334 5.58333 17.7084 7.325 17.7084H12.675C14.425 17.7084 14.4583 17.2334 14.5417 15.9667L15.0833 7.57506C15.1083 7.2334 15.4083 6.97506 15.75 6.99173C16.0917 7.01673 16.3583 7.3084 16.3333 7.6584L15.7917 16.0501C15.7 17.3501 15.5833 18.9584 12.675 18.9584Z" fill="#EF3A4B" />
                            <path d="M11.3834 14.375H8.6084C8.26673 14.375 7.9834 14.0917 7.9834 13.75C7.9834 13.4083 8.26673 13.125 8.6084 13.125H11.3834C11.7251 13.125 12.0084 13.4083 12.0084 13.75C12.0084 14.0917 11.7251 14.375 11.3834 14.375Z" fill="#EF3A4B" />
                            <path d="M12.0837 11.0417H7.91699C7.57533 11.0417 7.29199 10.7584 7.29199 10.4167C7.29199 10.0751 7.57533 9.79175 7.91699 9.79175H12.0837C12.4253 9.79175 12.7087 10.0751 12.7087 10.4167C12.7087 10.7584 12.4253 11.0417 12.0837 11.0417Z" fill="#EF3A4B" />
                        </svg>
                    </div>
                </div>
            )
        },
    },
    // {
    //     accessorKey: "status",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Status" />
    //     ),
    //     cell: ({ row }) => {
    //         const status = statuses.find(
    //             (status) => status.value === row.getValue("status")
    //         )

    //         if (!status) {
    //             return null
    //         }

    //         return (
    //             <div className="flex w-[100px] items-center">
    //                 {status.icon && (
    //                     <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
    //                 )}
    //                 <span>{status.label}</span>
    //             </div>
    //         )
    //     },
    //     filterFn: (row, id, value) => {
    //         return value.includes(row.getValue(id))
    //     },
    // },
    // {
    //     id: "actions",
    //     cell: ({ row }) => <DataTableRowActions row={row} />,
    // },
]

export const requestedAccountColumns: ColumnDef<UserInfoType>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Sr." />
        ),
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "studentId",
        header: () => "Student ID",
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[350px] truncate font-medium">
                        {row.getValue("studentId")}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Student Name" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[350px] truncate font-medium">
                        {row.getValue("name")}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "email",
        header: () => "Email",
        cell: ({ row }) => {
            return (
                <div className="w-[150px] truncate">
                    <span>{row.getValue("email")}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "joined On",
        header: () => "Joined On",
        cell: ({ row }) => {
            return (
                <div className="flex w-[100px] items-center">
                    <span>{row?.original?.createdAt}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "actions`",
        header: () => "Actions",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-3">
                    <ApproveAccountRequest studentId={row?.original.studentId} />
                    <DenyAccountRequest studentId={row?.original.studentId} />
                </div>
            )
        },
    },
]

export const requestForBorrowingBooksColumns: ColumnDef<AllBorrowRequestsTableInterface>[] = [
    {
        id: "id",
        header: () => "Sr.",
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "bookNumber",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Book Number" />
        ),
        cell: ({ row }) => <div>{row?.original?.book?.bookNumber}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "bookName",
        header: () => "Book Name",
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[250px] truncate">
                        {row?.original?.book?.bookName}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "author",
        header: () => "Author",
        cell: ({ row }) => {
            return (
                <div className="w-32 truncate">
                    {row?.original?.book?.author}
                </div>
            )
        },
    },
    {
        accessorKey: "studentName",
        header: () => <span>Student Name</span>,
        cell: ({ row }) => {
            return (
                <div className="w-24 truncate">
                    <span>{row?.original?.user?.name}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "studentId",
        header: () => <span>Student Id</span>,
        cell: ({ row }) => {
            return (
                <div className="w-24 truncate">
                    <span>{row?.original?.user?.studentId}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: () => "Request Status",
        cell: ({ row }) => {
            const colorAgainstStatuses = {
                "accepted": "text-green-700",
                "rejected": "text-pink-700",
                "pending": "text-blue-700",
            }
            const status = row?.original?.status;
            return (
                <div className="flex space-x-2">
                    <Badge variant="outline" className={`${colorAgainstStatuses[status]} bg-[#ECFDF3]`}>{status}</Badge>
                </div>
            )
        },
    },
    {
        accessorKey: "requestedOn",
        header: () => <span>Requested On</span>,
        cell: ({ row }) => {
            return (
                <div>
                    <span>{row?.original?.requestedOn}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "actions",
        header: () => "Actions",
        cell: ({ row }) => {
            // State to control the visibility of the alert dialog
            const [isAlertOpen, setIsAlertOpen] = useState(false);
            const queryClient = useQueryClient();
            const { state }: { state: { pageNumber: number, searchQuery: string } } = useLocation();

            // The book data from the current row
            const bookRequest = row.original;

            const changeBookStatusMutation = useMutation({
                mutationKey: ['change-borrow-book-status', bookRequest.id],
                // The mutation function now accepts an object with the status
                mutationFn: async (variables: { status: 'accepted' | 'rejected' }) => {
                    const token = localStorage.getItem("adminToken");
                    const { data } = await api.post(`/api/admin/borrow-requests/change-status/${bookRequest.id}`,
                        { status: variables.status },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            },
                            withCredentials: true,
                        }
                    );
                    console.log("return response: ", data);
                    return data;
                },
                onError: (error) => {
                    console.error("Mutation Error:", error);
                    toast.error("Something went wrong. Please try again.", {
                        icon: <X stroke="red" />,
                    });
                },
                onSuccess: (data: { status: string }) => {
                    console.log("data: ", data);
                    toast.success("Book status updated successfully!", {
                        icon: <CheckCircle stroke="green" />,
                    });

                    // update the borrow request status with your actual query key
                    queryClient.setQueryData(
                        ['borrow-requests', state?.pageNumber || 0, state?.searchQuery || 'nothing to query'],
                        (oldData: { totalPages: number, requests: AllBorrowRequestsTableInterface[] }) => {

                            if (oldData?.requests && oldData?.requests.length) {
                                const newData = oldData?.requests.map((request: AllBorrowRequestsTableInterface) => {
                                    if (request?.id == row?.original?.id) {
                                        return {
                                            ...request,
                                            status: data?.status,
                                        }
                                    } else return request;
                                })
                                return {
                                    totalPages: oldData?.totalPages,
                                    requests: newData
                                };
                            }
                            return oldData;
                        }
                    );
                    console.log("state?.searchQuery || state?.searchQuery != 'nothing to query': ", state?.searchQuery && state?.searchQuery != 'nothing to query');
                    console.log("state?.searchQuery", state?.searchQuery);
                    if (state?.searchQuery && state?.searchQuery != 'nothing to query') {
                        // queryClient.setQueryData(
                        //     ['borrow-requests', 0, 'nothing to query'],
                        //     (oldData: { totalPages: number, requests: AllBorrowRequestsTableInterface[] }) => {

                        //         if (oldData?.requests && oldData?.requests.length) {
                        //             const newData = oldData?.requests.map((request: AllBorrowRequestsTableInterface) => {
                        //                 if (request?.id == row?.original?.id) {
                        //                     return {
                        //                         ...request,
                        //                         status: data?.status,
                        //                     }
                        //                 } else return request;
                        //             })
                        //             return {
                        //                 totalPages: oldData?.totalPages,
                        //                 requests: newData
                        //             };
                        //         }
                        //         return oldData;
                        //     }
                        // );

                        queryClient.invalidateQueries({ queryKey: ['borrow-requests', 0, 'nothing to query'] }); // Replace with your actual query key
                    }

                    setIsAlertOpen(false); // Close the dialog on success
                },
            });

            return (
                <>
                    {/* Button to trigger the alert dialog */}
                    {row?.original?.status == "pending" ?
                        <Button
                            variant="outline"
                            onClick={() => setIsAlertOpen(true)}
                            disabled={changeBookStatusMutation?.isPending}
                        >
                            {changeBookStatusMutation?.isPending ? "Updating" : "Update Status"}
                        </Button>
                        : "N/A"
                    }

                    {/* Alert Dialog for confirmation */}
                    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You are about to change the borrowing status for:
                                    <span className="mt-2 font-medium text-black">
                                        <span className="block">User: {bookRequest?.user?.name}</span>
                                        <span className="block">Student ID: {bookRequest?.user?.studentId}</span>
                                    </span>
                                    <span className="block mt-3">Please select the new status below.</span>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="w-full flex justify-between sm:justify-between">
                                <AlertDialogCancel>Back</AlertDialogCancel>
                                <div className="flex gap-2">
                                    {/* Reject Button */}
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            changeBookStatusMutation.mutate({ status: 'rejected' });
                                        }}
                                        disabled={changeBookStatusMutation.isPending}
                                    >
                                        {changeBookStatusMutation.isPending ? 'Updating...' : 'Reject'}
                                    </Button>
                                    {/* Accept Button */}
                                    <Button
                                        onClick={() => {
                                            changeBookStatusMutation.mutate({ status: 'accepted' });
                                        }}
                                        disabled={changeBookStatusMutation.isPending}
                                    >
                                        {changeBookStatusMutation.isPending ? 'Updating...' : 'Accept'}
                                    </Button>
                                </div>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            );
        },
    }
]

export const borrowedBooksColumns: ColumnDef<AllBorrowedBooksTableInterface>[] = [
    {
        id: "id",
        header: () => "Sr.",
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "bookNumber",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Book Number" />
        ),
        cell: ({ row }) => <div>{row?.original?.bookCopy?.book?.bookNumber}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "bookName",
        header: () => "Book Name",
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[250px] truncate">
                        {row?.original?.bookCopy?.book?.bookName}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "studentName",
        header: () => <span>Student Name</span>,
        cell: ({ row }) => {
            return (
                <div className="w-24 truncate">
                    <span>{row?.original?.user?.name}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "studentId",
        header: () => <span>Student Id</span>,
        cell: ({ row }) => {
            return (
                <div className="w-24 truncate">
                    <span>{row?.original?.user?.studentId}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: () => "Borrow Status",
        cell: ({ row }) => {
            const colorAgainstStatuses = {
                "borrowed": "text-green-700",
                "returned": "text-pink-700",
            }
            const status = row?.original?.status;
            return (
                <div className="flex space-x-2">
                    <Badge variant="outline" className={`${colorAgainstStatuses[status]} bg-[#ECFDF3]`}>{status}</Badge>
                </div>
            )
        },
    },
    {
        accessorKey: "borrowedOn",
        header: () => <span>Borrowed On</span>,
        cell: ({ row }) => {
            return (
                <div>
                    <span>{format(new Date(row?.original?.borrowedOn), 'dd/MM/yyyy')}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "dueDate",
        header: () => <span>Due Date</span>,
        cell: ({ row }) => {
            return (
                <div>
                    <span>{format(new Date(row?.original?.dueDate), 'dd/MM/yyyy')}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "returned",
        header: () => <span>Returned</span>,
        cell: ({ row }) => {
            return (
                <div>
                    <span>{row?.original?.returnedOn ? format(new Date(row?.original?.returnedOn), 'dd/MM/yyyy') : "N/A"}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "actions",
        header: () => "Actions",
        cell: ({ row }) => {
            // State to control the visibility of the alert dialog
            const [isAlertOpen, setIsAlertOpen] = useState(false);

            // The book data from the current row
            const bookRequest = row.original;

            const changeBookStatusMutation = useMutation({
                mutationKey: ['change-borrow-book-status', bookRequest.id],
                // The mutation function now accepts an object with the status
                mutationFn: async (variables: { status: 'accepted' | 'rejected' }) => {
                    const token = localStorage.getItem("adminToken");
                    const { data } = await api.post(`/api/admin/borrow-requests/change-status/${bookRequest.id}`,
                        { status: variables.status },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            },
                            withCredentials: true,
                        }
                    );
                    console.log("return response: ", data);
                    return data;
                },
                onError: (error) => {
                    console.error("Mutation Error:", error);
                    toast.error("Something went wrong. Please try again.", {
                        icon: <X stroke="red" />,
                    });
                },
                onSuccess: (data: { status: string }) => {
                    console.log("data: ", data);
                    toast.success("Book status updated successfully!", {
                        icon: <CheckCircle stroke="green" />,
                    });

                    setIsAlertOpen(false); // Close the dialog on success
                },
            });

            return (
                <>
                    {/* Button to trigger the alert dialog */}
                    {row?.original?.status == "borrowed" ?
                        <Button
                            variant="outline"
                            onClick={() => setIsAlertOpen(true)}
                            disabled={changeBookStatusMutation?.isPending}
                        >
                            {changeBookStatusMutation?.isPending ? "Updating" : "Update Status"}
                        </Button>
                        : "N/A"
                    }

                    {/* Alert Dialog for confirmation */}
                    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You are about to change the borrowing status for:
                                    <span className="mt-2 font-medium text-black">
                                        <span className="block">User: {bookRequest?.user?.name}</span>
                                        <span className="block">Student ID: {bookRequest?.user?.studentId}</span>
                                    </span>
                                    <span className="block mt-3">Please select the new status below.</span>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="w-full flex justify-between sm:justify-between">
                                <AlertDialogCancel>Back</AlertDialogCancel>
                                <div className="flex gap-2">
                                    {/* Reject Button */}
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            changeBookStatusMutation.mutate({ status: 'rejected' });
                                        }}
                                        disabled={changeBookStatusMutation.isPending}
                                    >
                                        {changeBookStatusMutation.isPending ? 'Updating...' : 'Reject'}
                                    </Button>
                                    {/* Accept Button */}
                                    <Button
                                        onClick={() => {
                                            changeBookStatusMutation.mutate({ status: 'accepted' });
                                        }}
                                        disabled={changeBookStatusMutation.isPending}
                                    >
                                        {changeBookStatusMutation.isPending ? 'Updating...' : 'Accept'}
                                    </Button>
                                </div>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            );
        },
    }
]