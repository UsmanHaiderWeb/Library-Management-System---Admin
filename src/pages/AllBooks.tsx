/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { memo, useEffect, useRef, useState } from "react"
import { bookTableColumns } from "./Table/columns"
import { DataTable } from "./Table/data-table"
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/AxiosCalls";
import { BookInterface } from "@/lib/types&interfaces";

import { DateRange } from "react-day-picker";

const fetchAllBooks = async ({ pageNumber, searchQuery, fromDate, toDate }: { pageNumber: number, searchQuery: string, fromDate?: string, toDate?: string }) => {
    const { data } = await api.get(`/api/admin/getAllBooks`, {
        params: { pageNumber, searchQuery, fromDate: fromDate || '', toDate: toDate || '' },
    });
    return data;
}

function AllBooks() {
    const [pageNumber, setPageNumber] = useState(0);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchQueryForApi, setSearchQueryForApi] = useState<string>('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [dateRangeForApi, setDateRangeForApi] = useState<DateRange | undefined>(undefined);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const dateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const { data, isPending, refetch } = useQuery<{ totalPages: number, books: BookInterface[] }>({
        queryKey: ['books', pageNumber, searchQueryForApi || 'nothing to query', dateRangeForApi?.from?.toISOString(), dateRangeForApi?.to?.toISOString()],
        queryFn: () => fetchAllBooks({
            pageNumber,
            searchQuery: searchQueryForApi,
            fromDate: dateRangeForApi?.from?.toISOString(),
            toDate: dateRangeForApi?.to?.toISOString()
        }),
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
        }, 3000) // 3 second debounce

        return () => {
            clearTimeout((typingTimeoutRef.current as any))
        }
    }, [searchQuery])

    useEffect(() => {
        setPageNumber(0);
        if (dateTimeoutRef.current) {
            clearTimeout(dateTimeoutRef.current);
        }

        dateTimeoutRef.current = setTimeout(() => {
            setDateRangeForApi(dateRange);
        }, 1000)

        return () => {
            if (dateTimeoutRef.current) clearTimeout(dateTimeoutRef.current);
        }
    }, [dateRange])

    return (
        <div className="px-7 w-full pb-10">
            <title>List All Books - GICCL | Library</title>
            <DataTable
                data={data?.books || []}
                columns={bookTableColumns}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                totalPages={data?.totalPages || 1}
                refetchData={refetch}
                loadingData={isPending || (searchQuery != searchQueryForApi) || (dateRange != dateRangeForApi)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                dateRange={dateRange}
                setDateRange={setDateRange}
            />
        </div>
    )
}
export default memo(AllBooks)