/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowUpRightFromSquare, Loader2, TrendingUp } from 'lucide-react';
import BookCover from '@/components/BookCover';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/AxiosCalls';
import { createChart, ColorType, LineSeries } from 'lightweight-charts';
import { useEffect, useRef, memo } from 'react';

const BorrowingChart = () => {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#64748b',
            },
            width: chartContainerRef.current.clientWidth,
            height: 200,
            grid: {
                vertLines: { visible: false },
                horzLines: { color: '#f1f5f9' },
            },
            timeScale: {
                borderVisible: false,
            },
            rightPriceScale: {
                borderVisible: false,
            },
        });

        const lineSeries = chart.addSeries(LineSeries, {
            color: '#2563eb',
            lineWidth: 2,
        });

        // Mock data for trends
        const data = [
            { time: '2026-03-01', value: 12 },
            { time: '2026-03-02', value: 15 },
            { time: '2026-03-03', value: 14 },
            { time: '2026-03-04', value: 18 },
            { time: '2026-03-05', value: 25 },
            { time: '2026-03-06', value: 22 },
            { time: '2026-03-07', value: 30 },
            { time: '2026-03-08', value: 28 },
            { time: '2026-03-09', value: 35 },
            { time: '2026-03-10', value: 42 },
        ];

        lineSeries.setData(data);

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    return <div ref={chartContainerRef} className="w-full" />;
};

const HomePage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken') || '';

    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const { data } = await api.get('/api/admin/dashboard-stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data.stats;
        },
        enabled: !!token,
    });

    const { data: recentBooksData } = useQuery({
        queryKey: ['all-books', 0, ''],
        queryFn: async () => {
            const { data } = await api.get(`/api/books/getAllBooks?pageNumber=0&searchQuery=`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data.books;
        },
        enabled: !!token
    });

    return (
        <div className="p-6">
            <title>Admin Dashboard - GICCL | Library</title>
            {/* Top summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardDescription className="flex items-center gap-2 text-blue-600 font-medium">
                                Active Borrowed Books
                            </CardDescription>
                            <CardTitle className="text-3xl mt-1 font-bold">
                                {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : stats?.activeLoans || 0}
                            </CardTitle>
                        </div>
                        <Link to="/borrowed-books">
                            <Button size='sm' variant='outline' className="text-xs h-8 px-3">View All</Button>
                        </Link>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardDescription className="flex items-center gap-2 text-green-600 font-medium">
                                Total Users
                            </CardDescription>
                            <CardTitle className="text-3xl mt-1 font-bold">
                                {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : stats?.totalStudents || 0}
                            </CardTitle>
                        </div>
                        <Link to="/users">
                            <Button size='sm' variant='outline' className="text-xs h-8 px-3 text-green-600">View All</Button>
                        </Link>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardDescription className="flex items-center gap-2 text-purple-600 font-medium">
                                Total Books
                            </CardDescription>
                            <CardTitle className="text-3xl mt-1 font-bold">
                                {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : stats?.totalBooks || 0}
                            </CardTitle>
                        </div>
                        <Link to="/books">
                            <Button size='sm' variant='outline' className="text-xs h-8 px-3 text-purple-600">View All</Button>
                        </Link>
                    </CardHeader>
                </Card>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left column: Trends & Requests */}
                <div className="flex flex-col gap-6">
                    {/* Borrowing Trends Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                                Borrowing Trends
                            </CardTitle>
                            <CardDescription>Daily book borrowing activity for the last 10 days.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BorrowingChart />
                        </CardContent>
                    </Card>

                    {/* Borrow Requests Summary */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg">Pending Borrow Requests</CardTitle>
                            <Link to="/borrow-requests">
                                <Button variant="outline" size='sm' className="text-xs">Manage</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between py-2">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-blue-600">
                                        {isLoading ? <Loader2 className="animate-spin" /> : stats?.pendingRequests || 0}
                                    </span>
                                    <span className="text-sm text-gray-500 font-medium">Requests awaiting action</span>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-full">
                                    <ArrowUpRightFromSquare className="w-6 h-6 text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right column: Recently Added Books */}
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg">Recently Added Books</CardTitle>
                            <Link to="/books">
                                <Button variant="outline" size='sm' className="text-xs">View all</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <Button
                                    variant="outline"
                                    className="w-full flex items-center gap-2 justify-center border-dashed text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50"
                                    onClick={() => navigate('/books/add-new')}
                                >
                                    <Plus className="w-5 h-5" /> Add New Book
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {recentBooksData?.slice(0, 4).map((book: any) => (
                                    <div key={book.id} className="flex items-center gap-3 bg-gray-50/50 hover:bg-white rounded-xl p-3 border border-transparent hover:border-gray-200 transition-all shadow-sm">
                                        <div className="shrink-0">
                                            <BookCover coverColor="#f3f4f6" coverImage={book?.image} variant='extraSmall' />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-gray-800 text-sm truncate">{book.bookName}</div>
                                            <div className="text-xs text-gray-500 truncate">By {book.author}</div>
                                            <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                                                <span>ID: {book.bookNumber}</span>
                                                <span>•</span>
                                                <span className="text-blue-500">{book.genre}</span>
                                            </div>
                                        </div>
                                        <Link to={`/books/edit/${book.id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"><ArrowUpRightFromSquare size={16} /></Button>
                                        </Link>
                                    </div>
                                ))}
                                {recentBooksData?.length === 0 && (
                                    <div className="text-center py-6 text-gray-400 text-sm italic">No books found.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Links / Account Requests */}
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <Link to="/account-requests" className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors gap-2 text-center text-xs text-gray-300 font-medium">
                                <div className="bg-blue-500/20 p-2 rounded-lg"><Users className="w-5 h-5 text-blue-400" /></div>
                                Account Requests
                            </Link>
                            <Link to="/purchase-requests" className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors gap-2 text-center text-xs text-gray-300 font-medium">
                                <div className="bg-purple-500/20 p-2 rounded-lg"><ShoppingCart className="w-5 h-5 text-purple-400" /></div>
                                Purchase Requests
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// Explicitly importing ShoppingCart since it's used in the JSX
import { ShoppingCart, Users } from 'lucide-react';

export default memo(HomePage);