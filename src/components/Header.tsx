import React from 'react';
import { LogOut, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    name?: string;
    email?: string;
    avatarUrl?: string;
    onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ name = 'Adrian Hajdin', email = 'adrian@jsmastery.pro', avatarUrl = '/dummyUserImage.png', onMenuToggle }) => {
    const navigate = useNavigate();

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
                <Button variant='ghost' className="ml-1 sm:ml-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
                </Button>
            </div>
        </header>
    );
};

export default Header;
