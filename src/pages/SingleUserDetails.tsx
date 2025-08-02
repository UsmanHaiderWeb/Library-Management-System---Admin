import { memo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StudentCard from "@/components/StudentCard";
import BookCover from "@/components/BookCover";
import { UserInfoType } from "@/lib/types&interfaces";
import { DataTable } from "./Table/data-table";
import { borrowedBooks } from "@/lib/utils";
import { borrowedBooksColumns } from "./Table/columns";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";


const mockBook = {
    id: '2',
    title: 'Jayne Castle - People in Glass Houses',
    author: 'Jayne Ann Krentz',
    genre: 'Strategic, Fantasy',
    coverColor: '#CCBAA5',
    coverUrl: 'https://covers.openlibrary.org/b/id/10523339-L.jpg',
    createdAt: '12/01/24',
    summary: `People in Glass Houses by Jayne Castle (a pseudonym for Jayne Ann Krentz) is a science fiction romance set in a future world where people with psychic abilities live in harmony with advanced technology. The story follows the main characters, Harriet and Sam, who are drawn together under unusual circumstances.\n\nHarriet, a talented psychic, works for a company that offers psychic services in a futuristic society. When she finds herself tangled in a dangerous situation involving a mysterious conspiracy, she enlists the help of Sam, a former investigator with a dark past. As they uncover the secrets surrounding a glass house—a mysterious structure central to their investigation—they must navigate their growing attraction while facing hidden dangers.\n\nThe novel combines elements of mystery, suspense, and romance, with a focus on psychic abilities, futuristic technology, and the complexities of relationships. The title, "People in Glass Houses," symbolizes the fragile nature of the world the characters inhabit and the vulnerabilities they face in their personal and professional lives.`,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // Placeholder video
};


const SingleUserDetails = () => {
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch user details using the id
        // This is a mock data for demonstration
        setUserInfo({
            studentId: "ST12345",
            name: "John Doe",
            email: "john.doe@example.com",
            class: "Class 10A",
            phoneNumber: "+1234567890"
        });
        setLoading(false);
    }, [userId]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!userInfo) {
        return <div className="flex items-center justify-center min-h-screen">User not found</div>;
    }

    return (
        <div className="px-8 pt-2 pb-12 overflow-hidden">
            <div>
                <div className="mb-8 max-w-lg">
                    {/* <h1 className="text-3xl font-bold mb-3">User Details</h1> */}
                    <StudentCard userInfo={userInfo} />
                </div>

                {/* Currently Borrowed Books Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Currently Borrowed Books</h2>
                    <div className="grid lg:grid-cols-2 gap-4">
                        {[1, 2].map((book) => (
                            <div key={book.toString()} className="flex flex-row items-center gap-6 pb-4">
                                <div className='py-5 px-5 rounded-xl' style={{ backgroundColor: `${mockBook.coverColor}33` }}>
                                    <BookCover
                                        coverColor={mockBook.coverColor}
                                        coverImage={mockBook.coverUrl}
                                        variant="medium"
                                        className="shadow-md"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col gap-4 max-w-96">
                                        <div>
                                            <div className="text-md flex items-center gap-1 opacity-80">
                                                <span>Created at:</span>
                                                <span>{mockBook.createdAt}</span>
                                            </div>
                                            <h1 className="text-2xl font-bold mb-1">{mockBook.title}</h1>
                                            <p className="mb-1 text-base font-medium text-gray-800">
                                                By {mockBook.author}
                                            </p>
                                            <div className="text-sm text-gray-400 mb-1">{mockBook.genre}</div>
                                        </div>
                                        <Button variant="default" className="flex items-center gap-2 bg-blue hover:bg-blue/90">
                                            <Pencil className="w-4 h-4" /> Edit Book
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
            </div>
            <div className="w-full pt-5">
                <h1 className="text-3xl font-semibold tracking-tight mb-4 pl-1">History</h1>
                <DataTable
                    data={borrowedBooks.slice(0, pageNumber)}
                    columns={borrowedBooksColumns}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    totalPages={borrowedBooks?.length - 1}
                    placeHolder="Find books by name"
                />
            </div>
        </div>
    );
};

export default memo(SingleUserDetails);