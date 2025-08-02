import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowUpRightFromSquare } from 'lucide-react';
import BookCover from '@/components/BookCover';
import { Link, useNavigate } from 'react-router-dom';

const mockBooks = [
    {
        id: '1',
        title: 'Inside Evil: Inside Evil Series, Book 1',
        author: 'Rachel Heng',
        genre: 'Strategic, Fantasy',
        coverColor: '#1a1a1a',
        coverUrl: 'https://covers.openlibrary.org/b/id/10523338-L.jpg',
        isLoanedBook: true,
    },
    {
        id: '2',
        title: 'Jayne Castle - People in Glass Houses',
        author: 'Jayne Castle',
        genre: 'Strategic, Fantasy',
        coverColor: '#e11d48',
        coverUrl: 'https://covers.openlibrary.org/b/id/10523339-L.jpg',
        isLoanedBook: true,
    },
    {
        id: '3',
        title: 'The Great Reclamation: A Novel',
        author: 'Rachel Heng',
        genre: 'Strategic, Fantasy',
        coverColor: '#2563eb',
        coverUrl: 'https://covers.openlibrary.org/b/id/10523340-L.jpg',
        isLoanedBook: true,
    },
];

const mockUsers = [
    { name: 'Marc Atenson', email: 'marcinne@gmail.com', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Susan Drake', email: 'contact@susandrake.com', initials: 'SD', color: 'bg-blue-200' },
    { name: 'Ronald Richards', email: 'ronaldrichard@mail.com', initials: 'RR', color: 'bg-yellow-200' },
    { name: 'Jane Cooper', email: 'janecooper@protonmail.com', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Ian Warren', email: 'iand.warren@mail.co', initials: 'IW', color: 'bg-green-200' },
    { name: 'Darrell Steward', email: 'darrellsteward@gmail.com', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
];

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6">
            {/* Top summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardDescription className="flex items-center gap-2">
                                Borrowed Books
                            </CardDescription>
                            <CardTitle className="text-3xl mt-2">145</CardTitle>
                        </div>
                        <div>
                            <Button size='sm' variant='greenOutline'>View All</Button>
                        </div>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardDescription className="flex items-center gap-2">
                                Total Users
                            </CardDescription>
                            <CardTitle className="text-3xl mt-2">317</CardTitle>
                        </div>
                        <Link to="/users">
                            <Button size='sm' variant='greenOutline'>View All</Button>
                        </Link>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardDescription className="flex items-center gap-2">
                                Total Books
                            </CardDescription>
                            <CardTitle className="text-3xl mt-2">163</CardTitle>
                        </div>
                        <div>
                            <Button size='sm' variant='greenOutline'>View All</Button>
                        </div>
                    </CardHeader>
                </Card>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left column: Borrow Requests & Account Requests */}
                <div className="flex flex-col gap-6">
                    {/* Borrow Requests */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>Borrow Requests</CardTitle>
                            <Button variant="blueOutline" size='sm'>View all</Button>
                        </CardHeader>
                        <CardContent>
                            {mockBooks?.length !== 0 ? (
                                <div className="flex flex-col items-center justify-center pb-6">
                                    {/* Placeholder for illustration */}
                                    <div className="mb-6">
                                        <svg width="160" height="114" viewBox="0 0 160 114" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g filter="url(#filter0_dd_98001_27273)">
                                                <rect x="12" width="66" height="90" rx="8" fill="white" />
                                                <rect x="12.25" y="0.25" width="65.5" height="89.5" rx="7.75" stroke="#F8FBFF" stroke-width="0.5" />
                                            </g>
                                            <rect x="18.5" y="6.5" width="53" height="53" rx="5.5" fill="#EAF2FF" stroke="#F8FBFF" />
                                            <rect x="18" y="66" width="54" height="6" rx="3" fill="#E2ECFF" />
                                            <rect x="26" y="76.5" width="38" height="5" rx="2.5" fill="#EAF2FF" stroke="#F8FBFF" />
                                            <g filter="url(#filter1_dd_98001_27273)">
                                                <rect x="82" width="66" height="90" rx="8" fill="white" />
                                                <rect x="82.25" y="0.25" width="65.5" height="89.5" rx="7.75" stroke="#F8FBFF" stroke-width="0.5" />
                                            </g>
                                            <rect x="88.5" y="6.5" width="53" height="53" rx="5.5" fill="#EAF2FF" stroke="#F8FBFF" />
                                            <rect x="88" y="66" width="54" height="6" rx="3" fill="#E2ECFF" />
                                            <rect x="96" y="76.5" width="38" height="5" rx="2.5" fill="#EAF2FF" stroke="#F8FBFF" />
                                            <defs>
                                                <filter id="filter0_dd_98001_27273" x="0" y="0" width="90" height="114" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                    <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_98001_27273" />
                                                    <feOffset dy="4" />
                                                    <feGaussianBlur stdDeviation="3" />
                                                    <feColorMatrix type="matrix" values="0 0 0 0 0.0941176 0 0 0 0 0.137255 0 0 0 0 0.133333 0 0 0 0.03 0" />
                                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_98001_27273" />
                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                    <feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect2_dropShadow_98001_27273" />
                                                    <feOffset dy="12" />
                                                    <feGaussianBlur stdDeviation="8" />
                                                    <feColorMatrix type="matrix" values="0 0 0 0 0.0941176 0 0 0 0 0.137255 0 0 0 0 0.133333 0 0 0 0.08 0" />
                                                    <feBlend mode="normal" in2="effect1_dropShadow_98001_27273" result="effect2_dropShadow_98001_27273" />
                                                    <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_98001_27273" result="shape" />
                                                </filter>
                                                <filter id="filter1_dd_98001_27273" x="70" y="0" width="90" height="114" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                    <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_98001_27273" />
                                                    <feOffset dy="4" />
                                                    <feGaussianBlur stdDeviation="3" />
                                                    <feColorMatrix type="matrix" values="0 0 0 0 0.0941176 0 0 0 0 0.137255 0 0 0 0 0.133333 0 0 0 0.03 0" />
                                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_98001_27273" />
                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                    <feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect2_dropShadow_98001_27273" />
                                                    <feOffset dy="12" />
                                                    <feGaussianBlur stdDeviation="8" />
                                                    <feColorMatrix type="matrix" values="0 0 0 0 0.0941176 0 0 0 0 0.137255 0 0 0 0 0.133333 0 0 0 0.08 0" />
                                                    <feBlend mode="normal" in2="effect1_dropShadow_98001_27273" result="effect2_dropShadow_98001_27273" />
                                                    <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_98001_27273" result="shape" />
                                                </filter>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div className="text-lg font-semibold text-gray-700 mb-2 text-center">No Pending Book Requests</div>
                                    <div className="text-gray-400 text-center max-w-xs text-sm">There are no borrow book requests awaiting your r+eview at this time.</div>
                                </div>
                            ) : (
                                <ul className="space-y-4">
                                    {mockBooks.map((book) => (
                                        <li key={book.id} className="flex items-center gap-3 bg-bg rounded-lg p-2 shadow-sm">
                                            <BookCover coverColor={book.coverColor} coverImage={book?.coverUrl} variant='small' />
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-800 text-sm">{book.title}</div>
                                                <div className="text-xs text-gray-500">By {book.author} • {book.genre}</div>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                                    <span>Darrell Stewards</span>
                                                    <span>•</span>
                                                    <span>12/01/24</span>
                                                </div>
                                            </div>
                                            <Link to={book?.id}>
                                                <Button variant="ghost" size="icon"><ArrowUpRightFromSquare /></Button>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    {/* Account Requests */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>Account Requests</CardTitle>
                            <Button variant="blueOutline" size='sm'>View all</Button>
                        </CardHeader>
                        <CardContent>
                            {mockUsers?.length === 0 ? (
                                <div className="flex flex-col items-center justify-center pb-2">
                                    {/* Placeholder for illustration */}
                                    <div className="mb-6">
                                        <svg width="217" height="144" viewBox="0 0 217 144" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="109" cy="72" r="71.5" fill="#EAF2FF" stroke="#F8FBFF" />
                                            <g filter="url(#filter0_d_98001_27457)">
                                                <rect x="31" y="25" width="155" height="94" rx="6" fill="white" />
                                                <rect x="31.25" y="25.25" width="154.5" height="93.5" rx="5.75" stroke="#F8FBFF" stroke-width="0.5" />
                                            </g>
                                            <g filter="url(#filter1_dd_98001_27457)">
                                                <rect x="12" y="39" width="193" height="66" rx="8" fill="white" />
                                                <rect x="12.25" y="39.25" width="192.5" height="65.5" rx="7.75" stroke="#F8FBFF" stroke-width="0.5" />
                                            </g>
                                            <rect x="18.5" y="45.5" width="53" height="53" rx="5.5" fill="#EAF2FF" stroke="#F8FBFF" />
                                            <rect x="82" y="51" width="101" height="8" rx="4" fill="#E2ECFF" />
                                            <rect x="82.5" y="71.5" width="113" height="7" rx="3.5" fill="#EAF2FF" stroke="#F8FBFF" />
                                            <rect x="82.5" y="86.5" width="86" height="7" rx="3.5" fill="#EAF2FF" stroke="#F8FBFF" />
                                            <defs>
                                                <filter id="filter0_d_98001_27457" x="29" y="24" width="159" height="98" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                    <feOffset dy="1" />
                                                    <feGaussianBlur stdDeviation="1" />
                                                    <feColorMatrix type="matrix" values="0 0 0 0 0.0941176 0 0 0 0 0.137255 0 0 0 0 0.133333 0 0 0 0.05 0" />
                                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_98001_27457" />
                                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_98001_27457" result="shape" />
                                                </filter>
                                                <filter id="filter1_dd_98001_27457" x="0" y="39" width="217" height="90" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                    <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_98001_27457" />
                                                    <feOffset dy="4" />
                                                    <feGaussianBlur stdDeviation="3" />
                                                    <feColorMatrix type="matrix" values="0 0 0 0 0.0941176 0 0 0 0 0.137255 0 0 0 0 0.133333 0 0 0 0.03 0" />
                                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_98001_27457" />
                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                    <feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect2_dropShadow_98001_27457" />
                                                    <feOffset dy="12" />
                                                    <feGaussianBlur stdDeviation="8" />
                                                    <feColorMatrix type="matrix" values="0 0 0 0 0.0941176 0 0 0 0 0.137255 0 0 0 0 0.133333 0 0 0 0.08 0" />
                                                    <feBlend mode="normal" in2="effect1_dropShadow_98001_27457" result="effect2_dropShadow_98001_27457" />
                                                    <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_98001_27457" result="shape" />
                                                </filter>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div className="text-lg font-semibold text-gray-700 mb-2 text-center">No Pending Account Requests</div>
                                    <div className="text-gray-400 text-center max-w-xs text-sm">There are currently no account requests awaiting approval.</div>
                                </div>
                            ) : (
                                <div className="flex flex-wrap justify-between gap-4 overflow-hidden">
                                    {mockUsers.map((user, i) => (
                                        <div key={i} className="w-[30%] flex-1 flex items-center flex-col gap-3">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                            ) : (
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-gray-700 ${user.color}`}>{user.initials}</div>
                                            )}
                                            <div className='text-center'>
                                                <div className="font-medium text-gray-800 text-sm leading-tight w-[90%] truncate">{user.name}</div>
                                                <div className="text-xs text-gray-400 w-[90%] truncate">{user.email}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right column: Recently Added Books */}
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>Recently Added Books</CardTitle>
                            <Button variant="blueOutline" size='sm'>View all</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <Button
                                    variant="outline"
                                    className="w-full flex items-center gap-2 justify-center"
                                    onClick={() => navigate('/books/add-new')}
                                >
                                    <Plus className="w-5 h-5" /> Add New Book
                                </Button>
                            </div>
                            <ul className="space-y-3">
                                {mockBooks.concat(mockBooks).map((book) => (
                                    <li key={book.id} className="flex items-center gap-3 bg-bg rounded-lg p-2 shadow-sm">
                                        <BookCover coverColor={book.coverColor} coverImage={book?.coverUrl} variant='small' />
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-800 text-sm">{book.title}</div>
                                            <div className="text-xs text-gray-500">By {book.author} • {book.genre}</div>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                                <span>Darrell Stewards</span>
                                                <span>•</span>
                                                <span>12/01/24</span>
                                            </div>
                                        </div>
                                        <Link to={book?.id}>
                                            <Button variant="ghost" size="icon"><ArrowUpRightFromSquare /></Button>
                                        </Link>
                                    </li>))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default HomePage; 