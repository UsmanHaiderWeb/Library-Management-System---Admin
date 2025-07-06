import { Link } from "react-router-dom";
import BookCover from "@/components/BookCover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { memo } from "react";
import { BookCoverVariant } from "@/lib/types&interfaces";
import { Calendar } from "lucide-react";

interface Book {
    id: string;
    title: string;
    author: string;
    genre?: string;
    rating?: number;
    totalCopies?: number;
    availableCopies?: number;
    description?: string;
    coverColor: string;
    coverUrl: string;
    videoUrl?: string;
    summary?: string;
    createdAt?: Date | null;
    isLoanedBook?: boolean;
    variant?: BookCoverVariant
}

const BookCard = ({
    id,
    title = "Usman",
    genre,
    coverColor,
    coverUrl,
    isLoanedBook = true,
    variant,
}: Book) => (
    <li className={cn(isLoanedBook && "xs:w-52 w-max")}>
        <Link
            to={`/books/${id}`}
            className={cn(isLoanedBook && "w-full flex flex-col items-center")}
        >
            <BookCover coverColor={coverColor} coverImage={coverUrl} variant={variant} />

            <div className={cn("mt-4", !isLoanedBook && "xs:max-w-40 max-w-28")}>
                <p className="book-title">{title}</p>
                <p className="book-genre">{genre}</p>
            </div>

            {isLoanedBook && (
                <div className="mt-3 w-full">
                    <div className="book-loaned">
                        <Calendar
                            width={18}
                            height={18}
                            className="object-contain"
                        />
                        <p className="text-light-100">11 days left to return 11 days left to return</p>
                    </div>

                    <Button className="book-btn">Download receipt</Button>
                </div>
            )}
        </Link>
    </li>
);

export default memo(BookCard);