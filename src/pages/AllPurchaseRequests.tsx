 
 
import { memo, useEffect, useRef, useState } from "react"
import { purchaseRequestColumns } from "./Table/columns"
import { DataTable } from "./Table/data-table"
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/AxiosCalls";
import { PurchaseRequestInterface } from "@/lib/types&interfaces";

const fetchAllPurchaseRequests = async ({ token, pageNumber, searchQuery }: { token: string, pageNumber: number, searchQuery: string }) => {
    const { data } = await api.get(`/api/admin/purchase-requests?page=${pageNumber}&search=${searchQuery}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    return data;
}

function AllPurchaseRequests() {
    const [pageNumber, setPageNumber] = useState(0);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchQueryForApi, setSearchQueryForApi] = useState<string>('');
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const token = localStorage.getItem('adminToken') || '';

    const { data, isPending, refetch } = useQuery<{ totalPages: number, requests: PurchaseRequestInterface[] }>({
        queryKey: ['purchase-requests', pageNumber, searchQueryForApi],
        queryFn: () => fetchAllPurchaseRequests({ token, pageNumber, searchQuery: searchQueryForApi }),
        enabled: !!token,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        setPageNumber(0);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setSearchQueryForApi(searchQuery);
        }, 1000)

        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        }
    }, [searchQuery])

    return (
        <div className="px-7 w-full pb-10">
            <title>Purchase Requests - GICCL | Library</title>
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Book Purchase Requests</h1>
            </div>
            <DataTable
                data={data?.requests || []}
                columns={purchaseRequestColumns}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                totalPages={data?.totalPages || 1}
                refetchData={refetch}
                loadingData={isPending || (searchQuery != searchQueryForApi)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                placeHolder="Search by book name or author..."
            />
        </div>
    )
}

export default memo(AllPurchaseRequests)
