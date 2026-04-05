import { memo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/AxiosCalls";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, RefreshCcw } from "lucide-react";

interface FineTransaction {
    _id: string;
    studentName: string;
    studentId: string;
    bookName: string;
    amount: number;
    daysOverdue: number;
    date: string;
}

function AllFines() {
    const token = localStorage.getItem("adminToken") || "";
    const [pageNumber, setPageNumber] = useState(0);

    const { data, isPending } = useQuery<{ fines: FineTransaction[]; totalPages: number; totalCount: number }>({
        queryKey: ["fines", pageNumber],
        queryFn: async () => {
            const { data } = await api.get(`/api/admin/fines?pageNumber=${pageNumber}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        },
        enabled: !!token,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    const fines = data?.fines || [];
    const totalPages = data?.totalPages || 1;
    const totalCount = data?.totalCount || 0;

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "dd MMM yyyy");
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="px-7 w-full pb-10">
            <title>Fines - GICCL | Library</title>

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Fine Transactions</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        All fine records for overdue books{totalCount > 0 && ` (${totalCount} total)`}
                    </p>
                </div>
            </div>

            {isPending ? (
                <div className="flex items-center justify-center py-20">
                    <RefreshCcw className="h-6 w-6 animate-spin text-gray-400" style={{ animationDuration: "0.5s" }} />
                    <span className="ml-2 text-gray-500">Loading fine records...</span>
                </div>
            ) : fines.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    No fine transactions found.
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Sr.</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Student Name</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Student ID</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Book Name</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Days Overdue</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fines.map((fine, index) => (
                                        <tr key={fine._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-gray-700">{pageNumber * fines.length + index + 1}</td>
                                            <td className="px-4 py-3 text-gray-900 font-medium">{fine.studentName}</td>
                                            <td className="px-4 py-3 text-gray-700">{fine.studentId}</td>
                                            <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{fine.bookName}</td>
                                            <td className="px-4 py-3 text-gray-900 font-semibold">
                                                <span className="text-red-600">{fine.amount}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="bg-orange-100 text-orange-700 text-xs px-2.5 py-1 rounded-full font-medium">
                                                    {fine.daysOverdue} {fine.daysOverdue === 1 ? "day" : "days"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">{formatDate(fine.date)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-gray-500">
                            Page {pageNumber + 1} of {totalPages}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPageNumber((prev) => Math.max(0, prev - 1))}
                                disabled={pageNumber === 0}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </button>
                            <button
                                onClick={() => setPageNumber((prev) => Math.min(totalPages - 1, prev + 1))}
                                disabled={pageNumber >= totalPages - 1}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default memo(AllFines);
