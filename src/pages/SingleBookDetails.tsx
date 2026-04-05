import { Button } from '@/components/ui/button';
import { Pencil, Loader2 } from 'lucide-react';
import BookCover from '@/components/BookCover';
import { memo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/AxiosCalls';
import { BookInterface } from '@/lib/types&interfaces';

function SingleBookDetails() {
    const { id } = useParams();
    const token = localStorage.getItem('adminToken') || '';

    const { data: book, isPending, error } = useQuery<BookInterface>({
        queryKey: ['book-details', id],
        queryFn: async () => {
            const { data } = await api.get(`/api/books/getBookDetails/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data.book;
        },
        enabled: !!id && !!token,
    });

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-gray-500">
                Book not found
            </div>
        );
    }

    const availableCopies = book._count?.copies ?? 0;
    const createdDate = book.createdAt ? new Date(book.createdAt).toLocaleDateString() : '';

    return (
        <div className="p-6 pb-10 max-w-5xl mx-auto">
            <div className="flex flex-row items-center gap-6 pb-4">
                <div className='py-7 px-20 rounded-xl' style={{ backgroundColor: `${book.image ? '#f3f4f6' : '#CCBAA5'}33` }}>
                    <BookCover
                        coverColor="#f3f4f6"
                        coverImage={book.image}
                        variant="medium"
                        className="shadow-md"
                    />
                </div>
                <div className="flex-1">
                    <div className="flex flex-col gap-4 max-w-96">
                        <div>
                            {createdDate && (
                                <div className="text-md flex items-center gap-1 opacity-80">
                                    <span>Created at:</span>
                                    <span>{createdDate}</span>
                                </div>
                            )}
                            <h1 className="text-2xl font-bold mb-1">{book.bookName}</h1>
                            <p className="mb-1 text-base font-medium text-gray-800">
                                By {book.author}
                            </p>
                            <div className="text-sm text-gray-400 mb-1">{book.genre}</div>
                            <div className="text-sm text-gray-500 mt-2 flex items-center gap-3">
                                <span>Total: <span className="font-semibold text-gray-700">{book.totalBooks}</span></span>
                                <span>•</span>
                                <span>Available: <span className="font-semibold text-green-600">{availableCopies}</span></span>
                                <span>•</span>
                                <span>Almirah: <span className="font-semibold text-gray-700">{book.almirahNumber}</span></span>
                                <span>•</span>
                                <span>Shelf: <span className="font-semibold text-gray-700">{book.shelfNumber}</span></span>
                            </div>
                            {book.isOnline && (
                                <div className="mt-2">
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Available Online</span>
                                </div>
                            )}
                        </div>
                        <Link to={`/books/edit/${book.id}`}>
                            <Button variant="default" className="flex items-center gap-2 bg-blue hover:bg-blue/90">
                                <Pencil className="w-4 h-4" /> Edit Book
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="mt-8 xl:max-w-4xl max-w-3xl">
                <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold pb-4">Summary</h3>
                    <div className="whitespace-pre-line text-gray-700 text-base leading-relaxed">
                        {(book as any).summary || 'No summary available.'}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(SingleBookDetails);
