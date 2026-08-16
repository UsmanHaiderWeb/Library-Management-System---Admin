import { memo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/AxiosCalls";
import { toast } from "sonner";
import { format } from "date-fns";
import { RefreshCcw } from "lucide-react";

interface RenewalRequest {
    id: string;
    studentName: string;
    studentId: string;
    bookName: string;
    requestedOn: string;
    currentDueDate: string;
    newDueDate: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
}

const statusStyles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
};

function AllRenewalRequests() {
    const token = localStorage.getItem("adminToken") || "";
    const queryClient = useQueryClient();
    const [actionInProgress, setActionInProgress] = useState<string | null>(null);

    const { data, isPending } = useQuery<{ renewalRequests: RenewalRequest[] }>({
        queryKey: ["renewal-requests"],
        queryFn: async () => {
            const { data } = await api.get("/api/admin/renewal-requests?status=PENDING", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        },
        enabled: !!token,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    const approveMutation = useMutation({
        mutationFn: async (requestId: string) => {
            setActionInProgress(requestId);
            const { data } = await api.post(
                `/api/admin/renewal-requests/${requestId}/approve`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return data;
        },
        onSuccess: () => {
            toast.success("Renewal request approved successfully");
            queryClient.invalidateQueries({ queryKey: ["renewal-requests"] });
            setActionInProgress(null);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to approve renewal request");
            setActionInProgress(null);
        },
    });

    const rejectMutation = useMutation({
        mutationFn: async (requestId: string) => {
            setActionInProgress(requestId);
            const { data } = await api.post(
                `/api/admin/renewal-requests/${requestId}/reject`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return data;
        },
        onSuccess: () => {
            toast.success("Renewal request rejected");
            queryClient.invalidateQueries({ queryKey: ["renewal-requests"] });
            setActionInProgress(null);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to reject renewal request");
            setActionInProgress(null);
        },
    });

    const requests = data?.renewalRequests || [];

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "dd MMM yyyy");
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="px-7 w-full pb-10">
            <title>Renewal Requests - GICCL | Library</title>

            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Renewal Requests</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage book renewal requests from students
                </p>
            </div>

            {/* The tour anchors the whole list region so the renewals chapter
                still runs when the queue is empty */}
            <div data-tour="renewals-list">
            {isPending ? (
                <div className="flex items-center justify-center py-20">
                    <RefreshCcw className="h-6 w-6 animate-spin text-gray-400" style={{ animationDuration: "0.5s" }} />
                    <span className="ml-2 text-gray-500">Loading renewal requests...</span>
                </div>
            ) : requests.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    No pending renewal requests found.
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Sr.</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Student Name</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Student ID</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Book Name</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Requested On</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Current Due Date</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">New Due Date</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((req, index) => (
                                    <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                                        <td className="px-4 py-3 text-gray-900 font-medium">{req.studentName}</td>
                                        <td className="px-4 py-3 text-gray-700">{req.studentId}</td>
                                        <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{req.bookName}</td>
                                        <td className="px-4 py-3 text-gray-700">{formatDate(req.requestedOn)}</td>
                                        <td className="px-4 py-3 text-gray-700">{formatDate(req.currentDueDate)}</td>
                                        <td className="px-4 py-3 text-gray-700">{formatDate(req.newDueDate)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[req.status] || "bg-gray-100 text-gray-800"}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {req.status === "PENDING" ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => approveMutation.mutate(req.id)}
                                                        disabled={actionInProgress === req.id}
                                                        className="bg-green-100 hover:bg-green-200 text-green-700 text-xs px-3 py-1.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {actionInProgress === req.id && approveMutation.isPending ? (
                                                            <RefreshCcw className="h-3 w-3 animate-spin inline" style={{ animationDuration: "0.3s" }} />
                                                        ) : (
                                                            "Approve"
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => rejectMutation.mutate(req.id)}
                                                        disabled={actionInProgress === req.id}
                                                        className="bg-red-100 hover:bg-red-200 text-red-700 text-xs px-3 py-1.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {actionInProgress === req.id && rejectMutation.isPending ? (
                                                            <RefreshCcw className="h-3 w-3 animate-spin inline" style={{ animationDuration: "0.3s" }} />
                                                        ) : (
                                                            "Reject"
                                                        )}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">--</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}

export default memo(AllRenewalRequests);
