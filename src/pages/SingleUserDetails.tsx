/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useState } from "react";
import { useParams } from "react-router-dom";
import StudentCard from "@/components/StudentCard";
import BookCover from "@/components/BookCover";
import { DataTable } from "./Table/data-table";
import { borrowedBooksColumns } from "./Table/columns";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/AxiosCalls";
import { Loader2 } from "lucide-react";

interface BorrowedBookData {
    id: string;
    title: string;
    author: string;
    coverImage: string;
    coverColor: string;
    category: string;
    borrowedOn: string;
    dueDate: string | null;
    returnedOn: string | null;
    status: "borrowed" | "returned";
}

const SingleUserDetails = () => {
    const { userId } = useParams();
    const [pageNumber, setPageNumber] = useState<number>(0);
    const token = localStorage.getItem('adminToken') || '';

    const { data, isPending, error } = useQuery<{ user: any; borrowedBooks: BorrowedBookData[] }>({
        queryKey: ['admin-user-details', userId],
        queryFn: async () => {
            const { data } = await api.get(`/api/admin/getUserDetails/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        },
        enabled: !!userId && !!token,
    });

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error || !data?.user) {
        return <div className="flex items-center justify-center min-h-screen text-gray-500">User not found</div>;
    }

    const userInfo = {
        studentId: data.user.studentId,
        name: data.user.name,
        email: data.user.email,
        class: '',
        phoneNumber: data.user.phoneNumber || '',
        role: data.user.role,
        fineBalance: 0,
    };

    const currentlyBorrowed = data.borrowedBooks.filter((b) => b.status === 'borrowed');
    const returnedBooks = data.borrowedBooks.filter((b) => b.status === 'returned');

    // Map returned books to table format expected by borrowedBooksColumns
    const historyTableData = returnedBooks.map((b) => ({
        id: b.id,
        user: { id: data.user.id, name: data.user.name, studentId: data.user.studentId },
        bookCopy: { book: { id: b.id, bookNumber: '', bookName: b.title } },
        borrowedOn: b.borrowedOn,
        dueDate: b.dueDate || '',
        returnedOn: b.returnedOn || '',
        status: b.status as "borrowed" | "returned",
    }));

    const pageSize = 20;
    const totalPages = Math.ceil(historyTableData.length / pageSize);
    const pagedData = historyTableData.slice(0, (pageNumber + 1) * pageSize);

    return (
        <div className="px-8 pt-2 pb-12 overflow-hidden">
            <div>
                <div className="mb-8 max-w-lg">
                    <StudentCard userInfo={userInfo} />
                </div>

                {/* Currently Borrowed Books Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">
                        Currently Borrowed Books ({currentlyBorrowed.length})
                    </h2>
                    {currentlyBorrowed.length === 0 ? (
                        <p className="text-gray-400 text-sm">No books currently borrowed.</p>
                    ) : (
                        <div className="grid lg:grid-cols-2 gap-4">
                            {currentlyBorrowed.map((book) => (
                                <div key={book.id} className="flex flex-row items-center gap-6 pb-4">
                                    <div className='py-5 px-5 rounded-xl' style={{ backgroundColor: `${book.coverColor || '#f3f4f6'}33` }}>
                                        <BookCover
                                            coverColor={book.coverColor || '#f3f4f6'}
                                            coverImage={book.coverImage}
                                            variant="medium"
                                            className="shadow-md"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-col gap-2 max-w-96">
                                            <div>
                                                <h1 className="text-xl font-bold mb-1">{book.title}</h1>
                                                <p className="mb-1 text-sm font-medium text-gray-800">
                                                    By {book.author}
                                                </p>
                                                <div className="text-xs text-gray-400 mb-1">{book.category}</div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Borrowed: {new Date(book.borrowedOn).toLocaleDateString()}
                                                    {book.dueDate && (
                                                        <span className="ml-2">
                                                            • Due: <span className={new Date(book.dueDate) < new Date() ? 'text-red-500 font-semibold' : ''}>
                                                                {new Date(book.dueDate).toLocaleDateString()}
                                                            </span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full pt-5">
                <h1 className="text-3xl font-semibold tracking-tight mb-4 pl-1">History</h1>
                <DataTable
                    data={pagedData}
                    columns={borrowedBooksColumns}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    totalPages={totalPages}
                    placeHolder="Find books by name"
                />
            </div>
        </div>
    );
};

export default memo(SingleUserDetails);
