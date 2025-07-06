import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import BookCover from '@/components/BookCover';
import { memo } from 'react';

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

function SingleBookDetails() {
    return (
        <div className="p-6 pb-10 max-w-5xl mx-auto">
            <div className="flex flex-row items-center gap-6 pb-4">
                <div className='py-7 px-20 rounded-xl' style={{ backgroundColor: `${mockBook.coverColor}33` }}>
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
            <div className="mt-8 xl:max-w-4xl max-w-3xl">
                {/* Summary */}
                <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold pb-4">Summary</h3>
                    <div className="whitespace-pre-line text-gray-700 text-base leading-relaxed">
                        {mockBook.summary}
                    </div>
                </div>
                {/* Video */}
                {/* <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Video</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg overflow-hidden aspect-video bg-gray-100 flex items-center justify-center">
                                <video
                                    src={mockBook.videoUrl}
                                    controls
                                    className="w-full h-full object-cover rounded-lg"
                                    poster={mockBook.coverUrl}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </CardContent>
                    </Card>
                </div> */}
            </div>
        </div>
    );
}

export default memo(SingleBookDetails)