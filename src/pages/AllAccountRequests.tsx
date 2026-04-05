/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { memo, useEffect, useRef, useState } from "react"
import { userColumn } from "./Table/columns"
import { DataTable } from "./Table/data-table"
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/AxiosCalls";
import { UserInfoType } from "@/lib/types&interfaces";

const fetchAllAccountRequests = async ({ token, pageNumber, searchQuery }: { token: string, pageNumber: number, searchQuery: string }) => {
    const { data } = await api.get(`/api/admin/getAllAccountRequests?pageNumber=${pageNumber}&searchQuery=${searchQuery}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    return data;
}

function AllAccountRequests() {
    const [pageNumber, setPageNumber] = useState(0);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchQueryForApi, setSearchQueryForApi] = useState<string>('');
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const token = localStorage.getItem('adminToken') || '';

    const { data, isPending, refetch } = useQuery<{ totalPages: number, users: UserInfoType[] }>({
        queryKey: ['all-account-requests', pageNumber, searchQueryForApi || 'nothing to query'],
        queryFn: () => fetchAllAccountRequests({ token, pageNumber, searchQuery: searchQueryForApi }),
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
        }, 3000) // 3 second debounce

        return () => {
            clearTimeout((typingTimeoutRef.current as any))
        }
    }, [searchQuery])

    return (
        <div className="px-7 w-full pb-10">
            <DataTable
                data={data?.users || []}
                columns={userColumn}
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
export default memo(AllAccountRequests)