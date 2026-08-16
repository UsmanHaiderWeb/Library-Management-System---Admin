import React from 'react';
import { LogOut, Menu, Compass } from 'lucide-react';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdminDetails } from '@/lib/AxiosCalls';
import { useTour } from './Tour/TourProvider';

interface HeaderProps {
    avatarUrl?: string;
    onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ avatarUrl = '/dummyUserImage.webp', onMenuToggle }) => {
    const navigate = useNavigate();
    const { startTour, availableChapters } = useTour();
    const token = localStorage.getItem('adminToken') || '';

    const { data } = useQuery<{ admin: { name: string; email: string } }>({
        queryKey: ['admin-details'],
        queryFn: getAdminDetails,
        enabled: !!token,
        staleTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
    });

    const name = data?.admin?.name || 'Admin';
    const email = data?.admin?.email || '';

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    return (
        <header className="px-4 sm:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Toggle navigation menu"
                >
                    <Menu className="w-5 h-5 text-gray-700" />
                </button>
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Welcome, {name.split(' ')[0]}</h1>
                    <p className="text-gray-500 text-xs sm:text-sm hidden sm:block">Monitor all of your users and books from here</p>
                </div>
            </div>
            <div className="flex items-center bg-white rounded-full shadow px-1 py-1 gap-2 sm:gap-3 border border-gray-200">
                <div className="relative">
                    <img src={avatarUrl} alt={name} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover" />
                    <span className="absolute bottom-0 left-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div className="hidden sm:flex flex-col justify-center">
                    <span className="font-medium text-gray-800 leading-tight text-sm">{name}</span>
                    <span className="text-xs text-gray-400 -mt-0.5">{email}</span>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant='ghost'
                            className="ml-1 h-8 w-8 sm:h-9 sm:w-9 rounded-full text-gray-400 hover:text-blue-600"
                            title="Show me around"
                            aria-label="Show me around"
                        >
                            <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="max-h-[70vh] overflow-y-auto">
                        <DropdownMenuItem onSelect={() => startTour()}>
                            Tour this page
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>All walkthroughs</DropdownMenuLabel>
                        {availableChapters.map((chapter) => (
                            <DropdownMenuItem key={chapter.id} onSelect={() => startTour(chapter.id)}>
                                {chapter.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button variant='ghost' className="ml-1 sm:ml-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
                </Button>
            </div>
        </header>
    );
};

export default Header;
