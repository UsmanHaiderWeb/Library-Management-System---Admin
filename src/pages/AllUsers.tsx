 
 
import { memo, useEffect, useRef, useState } from "react"
import { userColumn } from "./Table/columns"
import { DataTable } from "./Table/data-table"
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/AxiosCalls";
import { UserInfoType } from "@/lib/types&interfaces";

const fetchAllUsers = async ({ token, pageNumber, searchQuery, role }: { token: string, pageNumber: number, searchQuery: string, role?: string }) => {
    const { data } = await api.get(`/api/admin/getAllUsers?page=${pageNumber}&search=${searchQuery}${role ? `&role=${role}` : ''}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    return data;
}

function AllUsers() {
    const [pageNumber, setPageNumber] = useState(0);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchQueryForApi, setSearchQueryForApi] = useState<string>('');
    const [role, setRole] = useState<string>('');
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const token = localStorage.getItem('adminToken') || '';

    const { data, isPending, refetch } = useQuery<{ totalPages: number, users: UserInfoType[] }>({
        queryKey: ['users', pageNumber, searchQueryForApi, role],
        queryFn: () => fetchAllUsers({ token, pageNumber, searchQuery: searchQueryForApi, role }),
        enabled: !!token,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
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
        }, 1000) // 1 second debounce is enough

        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        }
    }, [searchQuery])

    return (
        <div className="px-7 w-full pb-10">
            <title>List All Users - GICCL | Library</title>
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
                onFilterChange={(filters) => {
                    const roleFilter = filters.find(f => f.id === 'role');
                    setRole(roleFilter?.value?.[0] || '');
                    setPageNumber(0);
                }}
            />
        </div>
    )
}
export default memo(AllUsers)