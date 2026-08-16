import { memo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOverdueSummary, triggerOverdueReminders } from "@/lib/AxiosCalls";
import { format } from "date-fns";
import { AlertTriangle, Bell, Clock, RefreshCcw, Send } from "lucide-react";

interface OverdueBook {
    id: string;
    userName: string;
    userEmail: string;
    bookName: string;
    dueDate: string;
    daysOverdue?: number;
}

interface OverdueSummary {
    overdueCount: number;
    dueSoonCount: number;
    overdueBooks: OverdueBook[];
    dueSoonBooks: OverdueBook[];
}

function OverdueBooks() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<"overdue" | "due-soon">("overdue");

    const { data, isPending } = useQuery<{ success: boolean; data: OverdueSummary }>({
        queryKey: ["overdue-summary"],
        queryFn: getOverdueSummary,
        staleTime: 1000 * 60 * 2,
        refetchOnWindowFocus: false,
    });

    const triggerMutation = useMutation({
        mutationFn: triggerOverdueReminders,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["overdue-summary"] });
        },
    });

    const summary = data?.data;
    const overdueBooks = summary?.overdueBooks || [];
    const dueSoonBooks = summary?.dueSoonBooks || [];
    const activeList = activeTab === "overdue" ? overdueBooks : dueSoonBooks;

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "dd MMM yyyy");
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="px-7 w-full pb-10">
            <title>Overdue Books - GICCL | Library</title>

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Overdue Management</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Track overdue books and send reminders to students
                    </p>
                </div>
                <button
                    onClick={() => triggerMutation.mutate()}
                    disabled={triggerMutation.isPending}
                    data-tour="overdue-send"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {triggerMutation.isPending ? (
                        <RefreshCcw className="h-4 w-4 animate-spin" style={{ animationDuration: "0.5s" }} />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                    Send Reminders
                </button>
            </div>

            {/* Success message */}
            {triggerMutation.isSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                    Reminders sent successfully! Due soon: {triggerMutation.data?.data?.dueSoon?.count || 0}, Overdue: {triggerMutation.data?.data?.overdue?.count || 0}
                </div>
            )}

            {/* Stats Cards */}
            {summary && (
                <div data-tour="overdue-stats" className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Overdue Books</p>
                                <p className="text-2xl font-bold text-red-600">{summary.overdueCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Due Within 2 Days</p>
                                <p className="text-2xl font-bold text-amber-600">{summary.dueSoonCount}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div data-tour="overdue-tabs" className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
                <button
                    onClick={() => setActiveTab("overdue")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "overdue"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Overdue ({overdueBooks.length})
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab("due-soon")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "due-soon"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Due Soon ({dueSoonBooks.length})
                    </span>
                </button>
            </div>

            {/* Table */}
            {isPending ? (
                <div className="flex items-center justify-center py-20">
                    <RefreshCcw className="h-6 w-6 animate-spin text-gray-400" style={{ animationDuration: "0.5s" }} />
                    <span className="ml-2 text-gray-500">Loading overdue data...</span>
                </div>
            ) : activeList.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    {activeTab === "overdue"
                        ? "No overdue books. Everything is on track!"
                        : "No books due in the next 2 days."}
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Sr.</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Student Name</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Book Name</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Due Date</th>
                                    {activeTab === "overdue" && (
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Days Overdue</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {activeList.map((item, index) => (
                                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                                        <td className="px-4 py-3 text-gray-900 font-medium">{item.userName}</td>
                                        <td className="px-4 py-3 text-gray-700">{item.userEmail}</td>
                                        <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{item.bookName}</td>
                                        <td className="px-4 py-3 text-gray-700">{formatDate(item.dueDate)}</td>
                                        {activeTab === "overdue" && (
                                            <td className="px-4 py-3">
                                                <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full font-medium">
                                                    {item.daysOverdue} {item.daysOverdue === 1 ? "day" : "days"}
                                                </span>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default memo(OverdueBooks);
