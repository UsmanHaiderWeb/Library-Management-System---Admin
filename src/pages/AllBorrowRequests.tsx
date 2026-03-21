/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useEffect, useRef, useState } from "react"
import { requestForBorrowingBooksColumns } from "./Table/columns"
import { DataTable } from "./Table/data-table"
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/AxiosCalls";
import { AllBorrowRequestsTableInterface } from "@/lib/types&interfaces";
import { useLocation, useNavigate } from "react-router-dom";
import { DateRange } from "react-day-picker";

const fetchAllBorrowRequests = async ({ token, pageNumber, searchQuery, fromDate, toDate }: { token: string, pageNumber: number, searchQuery: string, fromDate?: string, toDate?: string }) => {
    const { data } = await api.get(`/api/admin/all-borrow-requests?pageNumber=${pageNumber}&searchQuery=${searchQuery}&fromDate=${fromDate || ''}&toDate=${toDate || ''}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    return data;
}

function AllBorrowRequests() {
    const [pageNumber, setPageNumber] = useState(0);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchQueryForApi, setSearchQueryForApi] = useState<string>('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [dateRangeForApi, setDateRangeForApi] = useState<DateRange | undefined>(undefined);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const dateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const token = localStorage.getItem('adminToken') || '';
    const { state } = useLocation();
    const navigate = useNavigate();

    const { data, isPending, refetch } = useQuery<{ totalPages: number, requests: AllBorrowRequestsTableInterface[] }>({
        queryKey: ['borrow-requests', pageNumber, searchQueryForApi || 'nothing to query', dateRangeForApi?.from?.toISOString(), dateRangeForApi?.to?.toISOString()],
        queryFn: () => fetchAllBorrowRequests({ 
            token, 
            pageNumber, 
            searchQuery: searchQueryForApi,
            fromDate: dateRangeForApi?.from?.toISOString(),
            toDate: dateRangeForApi?.to?.toISOString()
        }),
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
            navigate("/borrow-requests", {
                replace: true,
                state: {
                    ...state,
                    searchQuery: searchQuery || 'nothing to query',
                }
            })
        }, 2000) // 2 second debounce
        
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
    
    useEffect(() => {
        navigate("/borrow-requests", {
            replace: true,
            state: {
                ...state,
                pageNumber,
            }
        })
    }, [pageNumber])

    return (
        <div className="px-7 w-full pb-10">
            <title>Borrow Requests - GICCL | Library</title>
            <DataTable
                data={data?.requests || []}
                columns={requestForBorrowingBooksColumns}
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
export default memo(AllBorrowRequests)