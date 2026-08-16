import { memo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAuditLogs, getAuditFilters } from "@/lib/AxiosCalls";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, RefreshCcw, Shield } from "lucide-react";

interface AuditLogEntry {
    id: string;
    adminId: string;
    action: string;
    entity: string;
    entityId: string | null;
    details: string | null;
    ipAddress: string | null;
    createdAt: string;
}

const ACTION_COLORS: Record<string, string> = {
    CREATE_BOOK: "bg-green-100 text-green-700",
    UPDATE_BOOK: "bg-blue-100 text-blue-700",
    DELETE_BOOK: "bg-red-100 text-red-700",
    APPROVE_ACCOUNT: "bg-green-100 text-green-700",
    DENY_ACCOUNT: "bg-red-100 text-red-700",
    UPDATE_ROLE: "bg-purple-100 text-purple-700",
    CHANGE_BORROW_STATUS: "bg-blue-100 text-blue-700",
    CHANGE_RETURN_STATUS: "bg-amber-100 text-amber-700",
    UPDATE_PURCHASE_STATUS: "bg-blue-100 text-blue-700",
    PROCESS_RENEWAL: "bg-indigo-100 text-indigo-700",
    BULK_IMPORT_BOOKS: "bg-teal-100 text-teal-700",
    BULK_IMPORT_USERS: "bg-teal-100 text-teal-700",
    TRIGGER_REMINDERS: "bg-orange-100 text-orange-700",
};

function AuditLogs() {
    const [pageNumber, setPageNumber] = useState(0);
    const [actionFilter, setActionFilter] = useState<string>("");
    const [entityFilter, setEntityFilter] = useState<string>("");

    const { data, isPending } = useQuery<{ logs: AuditLogEntry[]; totalPages: number; totalCount: number }>({
        queryKey: ["audit-logs", pageNumber, actionFilter, entityFilter],
        queryFn: () =>
            getAuditLogs({
                pageNumber,
                action: actionFilter || undefined,
                entity: entityFilter || undefined,
            }),
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
    });

    const { data: filters } = useQuery<{ actions: string[]; entities: string[] }>({
        queryKey: ["audit-filters"],
        queryFn: getAuditFilters,
        staleTime: 1000 * 60 * 10,
    });

    const logs = data?.logs || [];
    const totalPages = data?.totalPages || 1;
    const totalCount = data?.totalCount || 0;

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "dd MMM yyyy, hh:mm a");
        } catch {
            return dateStr;
        }
    };

    const formatAction = (action: string) =>
        action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    return (
        <div className="px-7 w-full pb-10">
            <title>Audit Logs - GICCL | Library</title>

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                    <Shield className="h-6 w-6 text-gray-700" />
                    <h1 className="text-2xl font-semibold text-gray-900">Audit Logs</h1>
                </div>
                <p className="text-sm text-gray-500">
                    Track all admin actions and changes{totalCount > 0 && ` (${totalCount} total entries)`}
                </p>
            </div>

            {/* Filters */}
            <div data-tour="audit-filters" className="flex gap-3 mb-4">
                <select
                    value={actionFilter}
                    onChange={(e) => {
                        setActionFilter(e.target.value);
                        setPageNumber(0);
                    }}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Actions</option>
                    {filters?.actions?.map((a) => (
                        <option key={a} value={a}>
                            {formatAction(a)}
                        </option>
                    ))}
                </select>
                <select
                    value={entityFilter}
                    onChange={(e) => {
                        setEntityFilter(e.target.value);
                        setPageNumber(0);
                    }}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Entities</option>
                    {filters?.entities?.map((e) => (
                        <option key={e} value={e}>
                            {e}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table — the tour anchors the whole region so the step still
                shows when the log is empty */}
            <div data-tour="audit-table">
            {isPending ? (
                <div className="flex items-center justify-center py-20">
                    <RefreshCcw className="h-6 w-6 animate-spin text-gray-400" style={{ animationDuration: "0.5s" }} />
                    <span className="ml-2 text-gray-500">Loading audit logs...</span>
                </div>
            ) : logs.length === 0 ? (
                <div className="text-center py-20 text-gray-500">No audit log entries found.</div>
            ) : (
                <>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Action</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Entity</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Details</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">IP Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => (
                                        <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                                                {formatDate(log.createdAt)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${ACTION_COLORS[log.action] || "bg-gray-100 text-gray-700"}`}
                                                >
                                                    {formatAction(log.action)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">{log.entity}</td>
                                            <td className="px-4 py-3 text-gray-600 max-w-[300px] truncate">
                                                {log.details || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 text-xs font-mono">
                                                {log.ipAddress || "-"}
                                            </td>
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
        </div>
    );
}

export default memo(AuditLogs);
