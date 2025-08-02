/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useEffect, useRef, useState } from "react"
import { borrowedBooksColumns } from "./Table/columns"
import { DataTable } from "./Table/data-table"
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/AxiosCalls";
import { AllBorrowedBooksTableInterface } from "@/lib/types&interfaces";

const fetchBorrowedBooks = async ({ token, pageNumber, searchQuery }: { token: string, pageNumber: number, searchQuery: string }) => {
    const { data } = await api.get(`/api/admin/all-borrowed-books?pageNumber=${pageNumber}&searchQuery=${searchQuery}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    return data;
}

function BorrowedBooks() {
    const [pageNumber, setPageNumber] = useState(0);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchQueryForApi, setSearchQueryForApi] = useState<string>('');
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const token = localStorage.getItem('adminToken') || '';

    const { data, isPending, refetch } = useQuery<{ totalPages: number, requests: AllBorrowedBooksTableInterface[] }>({
        queryKey: ['all-borrowed-books', pageNumber, searchQueryForApi || 'nothing to query'],
        queryFn: () => fetchBorrowedBooks({ token, pageNumber, searchQuery: searchQueryForApi }),
        enabled: !!token,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    useEffect(() => {
        setPageNumber(0);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            console.log("Sending API call with:", searchQuery)
            setSearchQueryForApi(searchQuery);
        }, 2000) // 2 second debounce

        return () => {
            clearTimeout((typingTimeoutRef.current as any))
        }
    }, [searchQuery])

    return (
        <div className="px-7 w-full pb-10">
            <DataTable
                data={data?.requests || []}
                columns={borrowedBooksColumns}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                totalPages={data?.totalPages || 1}
                refetchData={refetch}
                loadingData={isPending || (searchQuery != searchQueryForApi)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
        </div>
    )
}
export default memo(BorrowedBooks)