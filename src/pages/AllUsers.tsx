import { memo, useState } from "react"
import { userColumn } from "./Table/columns"
import { DataTable } from "./Table/data-table"
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/AxiosCalls";
import BoxSpinLoader from "@/components/loaders/BoxSpinLoader";
import { UserInfoType } from "@/lib/types&interfaces";

const fetchAllUsers = async ({ token, pageNumber }: { token: string, pageNumber: number }) => {
    const { data } = await api.get(`/api/admin/getAllUsers?pageNumber=${pageNumber}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    return data;
}

function AllUsers() {
    const [pageNumber, setPageNumber] = useState(0);
    const token = localStorage.getItem('adminToken') || '';

    const { data, isPending, refetch } = useQuery<{ totalPages: number, users: UserInfoType[] }>({
        queryKey: ['users', pageNumber],
        queryFn: () => fetchAllUsers({ token, pageNumber }),
        enabled: !!token,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    if (isPending) {
        return (
            <div className="flex justify-center items-center h-2/3">
                <BoxSpinLoader />
            </div>
        )
    }

    return (
        <div className="px-7 w-full pb-10">
            <DataTable
                data={data?.users}
                columns={userColumn}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                totalPages={data?.totalPages || 1}
                refetchData={refetch}
            />
        </div>
    )
}
export default memo(AllUsers)