import { memo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2, BarChart3, Users, BookOpen, Clock, AlertTriangle, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/AxiosCalls';

interface GenreItem {
    genre: string;
    count: number;
}

interface TopBook {
    bookName: string;
    author: string;
    borrowCount: number;
}

interface MonthlyBorrowing {
    month: string;
    count: number;
}

interface TopUser {
    name: string;
    studentId: string;
    borrowCount: number;
}

interface AnalyticsData {
    genreDistribution: GenreItem[];
    topBorrowedBooks: TopBook[];
    borrowingByMonth: MonthlyBorrowing[];
    userRoleDistribution: { STUDENT: number; FACULTY: number; STAFF: number };
    requestStats: { pending: number; accepted: number; rejected: number };
    purchaseRequestStats: { PENDING: number; APPROVED: number; REJECTED: number };
    topActiveUsers: TopUser[];
    overdueBooksCount: number;
    averageBorrowDuration: number;
    fineStats: { totalFines: number; usersWithFines: number };
}

const HorizontalBar = ({ label, value, max, color = 'bg-blue-500', suffix = '' }: {
    label: string;
    value: number;
    max: number;
    color?: string;
    suffix?: string;
}) => {
    const pct = max > 0 ? (value / max) * 100 : 0;
    return (
        <div className="flex items-center gap-3 py-1.5">
            <span className="text-sm text-gray-600 w-40 truncate shrink-0" title={label}>{label}</span>
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(pct, 2)}%` }}
                />
            </div>
            <span className="text-sm font-semibold text-gray-700 w-14 text-right shrink-0">{value}{suffix}</span>
        </div>
    );
};

const StatusBar = ({ label, value, total, color }: {
    label: string;
    value: number;
    total: number;
    color: string;
}) => {
    const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">{label}</span>
                <span className="font-medium text-gray-800">{value} ({pct}%)</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} rounded-full transition-all duration-500`}
                    style={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }}
                />
            </div>
        </div>
    );
};

const Analysis = () => {
    const token = localStorage.getItem('adminToken') || '';

    const { data: analytics, isLoading, isError } = useQuery<AnalyticsData>({
        queryKey: ['admin-analytics'],
        queryFn: async () => {
            const { data } = await api.get('/api/admin/analytics', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data.analytics;
        },
        enabled: !!token,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
            </div>
        );
    }

    if (isError || !analytics) {
        return (
            <div className="flex items-center justify-center h-96 text-gray-500">
                Failed to load analytics data.
            </div>
        );
    }

    const genreMax = Math.max(...(analytics.genreDistribution?.map(g => g.count) || [1]));
    const bookMax = Math.max(...(analytics.topBorrowedBooks?.map(b => b.borrowCount) || [1]));
    const monthMax = Math.max(...(analytics.borrowingByMonth?.map(m => m.count) || [1]));

    const roleTotal = (analytics.userRoleDistribution?.STUDENT || 0)
        + (analytics.userRoleDistribution?.FACULTY || 0)
        + (analytics.userRoleDistribution?.STAFF || 0);

    const borrowReqTotal = (analytics.requestStats?.pending || 0)
        + (analytics.requestStats?.accepted || 0)
        + (analytics.requestStats?.rejected || 0);

    const purchaseReqTotal = (analytics.purchaseRequestStats?.PENDING || 0)
        + (analytics.purchaseRequestStats?.APPROVED || 0)
        + (analytics.purchaseRequestStats?.REJECTED || 0);

    return (
        <div className="p-6 space-y-6">
            <title>Analytics & Reports - GICCL | Library</title>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-sm text-gray-500 mt-1">Overview of library usage and statistics</p>
            </div>

            {/* Summary Cards */}
            <div data-tour="analytics-summary" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardDescription className="flex items-center gap-2 text-orange-600 font-medium">
                                <AlertTriangle className="w-4 h-4" /> Overdue Books
                            </CardDescription>
                            <CardTitle className="text-3xl mt-1 font-bold">
                                {analytics.overdueBooksCount ?? 0}
                            </CardTitle>
                        </div>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardDescription className="flex items-center gap-2 text-blue-600 font-medium">
                                <Clock className="w-4 h-4" /> Avg Borrow Duration
                            </CardDescription>
                            <CardTitle className="text-3xl mt-1 font-bold">
                                {analytics.averageBorrowDuration?.toFixed(1) ?? '0'} <span className="text-base font-normal text-gray-400">days</span>
                            </CardTitle>
                        </div>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardDescription className="flex items-center gap-2 text-red-600 font-medium">
                                <DollarSign className="w-4 h-4" /> Total Fines
                            </CardDescription>
                            <CardTitle className="text-3xl mt-1 font-bold">
                                {analytics.fineStats?.totalFines?.toLocaleString() ?? 0}
                            </CardTitle>
                        </div>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardDescription className="flex items-center gap-2 text-purple-600 font-medium">
                                <Users className="w-4 h-4" /> Users with Fines
                            </CardDescription>
                            <CardTitle className="text-3xl mt-1 font-bold">
                                {analytics.fineStats?.usersWithFines ?? 0}
                            </CardTitle>
                        </div>
                    </CardHeader>
                </Card>
            </div>

            {/* Genre Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-500" />
                        Genre Distribution
                    </CardTitle>
                    <CardDescription>Number of books by genre</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        {analytics.genreDistribution?.map((g) => (
                            <HorizontalBar
                                key={g.genre}
                                label={g.genre}
                                value={g.count}
                                max={genreMax}
                                color="bg-blue-500"
                            />
                        ))}
                        {(!analytics.genreDistribution || analytics.genreDistribution.length === 0) && (
                            <p className="text-sm text-gray-400 italic py-4 text-center">No genre data available.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Top Borrowed Books */}
            <Card data-tour="analytics-top-books">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-green-500" />
                        Top 10 Most Borrowed Books
                    </CardTitle>
                    <CardDescription>Books with the highest borrow counts</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        {analytics.topBorrowedBooks?.slice(0, 10).map((b, i) => (
                            <HorizontalBar
                                key={`${b.bookName}-${i}`}
                                label={b.bookName}
                                value={b.borrowCount}
                                max={bookMax}
                                color="bg-green-500"
                            />
                        ))}
                        {(!analytics.topBorrowedBooks || analytics.topBorrowedBooks.length === 0) && (
                            <p className="text-sm text-gray-400 italic py-4 text-center">No borrowing data available.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* User Role Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-500" />
                        User Role Distribution
                    </CardTitle>
                    <CardDescription>Breakdown of users by role</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <StatusBar label="Student" value={analytics.userRoleDistribution?.STUDENT || 0} total={roleTotal} color="bg-indigo-500" />
                        <StatusBar label="Faculty" value={analytics.userRoleDistribution?.FACULTY || 0} total={roleTotal} color="bg-violet-500" />
                        <StatusBar label="Staff" value={analytics.userRoleDistribution?.STAFF || 0} total={roleTotal} color="bg-fuchsia-500" />
                    </div>
                </CardContent>
            </Card>

            {/* Request Stats - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Borrow Requests</CardTitle>
                        <CardDescription>Status breakdown of borrow requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <StatusBar label="Pending" value={analytics.requestStats?.pending || 0} total={borrowReqTotal} color="bg-yellow-500" />
                            <StatusBar label="Accepted" value={analytics.requestStats?.accepted || 0} total={borrowReqTotal} color="bg-green-500" />
                            <StatusBar label="Rejected" value={analytics.requestStats?.rejected || 0} total={borrowReqTotal} color="bg-red-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Purchase Requests</CardTitle>
                        <CardDescription>Status breakdown of purchase requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <StatusBar label="Pending" value={analytics.purchaseRequestStats?.PENDING || 0} total={purchaseReqTotal} color="bg-yellow-500" />
                            <StatusBar label="Approved" value={analytics.purchaseRequestStats?.APPROVED || 0} total={purchaseReqTotal} color="bg-green-500" />
                            <StatusBar label="Rejected" value={analytics.purchaseRequestStats?.REJECTED || 0} total={purchaseReqTotal} color="bg-red-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Active Borrowers */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-amber-500" />
                        Top Active Borrowers
                    </CardTitle>
                    <CardDescription>Users with the most borrows</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {analytics.topActiveUsers?.map((user, i) => (
                            <div key={`${user.studentId}-${i}`} className="flex items-center gap-4 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <span className="text-lg font-bold text-gray-300 w-8 text-center shrink-0">
                                    {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                                    <p className="text-xs text-gray-400">{user.studentId}</p>
                                </div>
                                <span className="text-sm font-bold text-amber-600 shrink-0">
                                    {user.borrowCount} borrows
                                </span>
                            </div>
                        ))}
                        {(!analytics.topActiveUsers || analytics.topActiveUsers.length === 0) && (
                            <p className="text-sm text-gray-400 italic py-4 text-center">No user data available.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Monthly Borrowing Trend */}
            <Card data-tour="analytics-trend">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-teal-500" />
                        Monthly Borrowing Trend
                    </CardTitle>
                    <CardDescription>Borrowing activity over the last 12 months</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        {analytics.borrowingByMonth?.slice(-12).map((m) => {
                            const [year, month] = m.month.split('-');
                            const date = new Date(Number(year), Number(month) - 1);
                            const label = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                            return (
                                <HorizontalBar
                                    key={m.month}
                                    label={label}
                                    value={m.count}
                                    max={monthMax}
                                    color="bg-teal-500"
                                />
                            );
                        })}
                        {(!analytics.borrowingByMonth || analytics.borrowingByMonth.length === 0) && (
                            <p className="text-sm text-gray-400 italic py-4 text-center">No monthly data available.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default memo(Analysis);
