import React from 'react';
import BookCover from '@/components/BookCover';
import { Link } from 'react-router-dom';

interface Book {
    bookId?: string;
    coverImage: string;
    coverColor: string;
    title: string;
    categories: string[];
}

interface BookListingProps {
    books: Book[];
    className?: string;
}

const BookListing: React.FC<BookListingProps> = ({ books, className = '' }) => {
    return (
        <div className={`grid lg:grid-cols-5 xl:grid-cols-6 gap-y-12 gap-x-4 pb-4 ${className}`}>
            {books?.map((book, idx) => (
                <div key={idx} className='w-full flex justify-center items-center'>
                    <Link to={`/book/${book.bookId}`} className="flex flex-col items-center min-w-[180px] max-w-60">
                        <div className="w-full hover:-translate-y-2 duration-150">
                            <BookCover coverImage={book.coverImage} coverColor={book.coverColor} variant="regular" />
                        </div>
                        <div className="mt-4 text-lg font-semibold text-simple text-center line-clamp-2">{book.title}</div>
                        <div className="italic line-clamp-2 text-primary text-base mt-1 text-center">{book.categories?.join(', ')}</div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default BookListing; 