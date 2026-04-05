import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    name?: string;
    email?: string;
    avatarUrl?: string;
}

const Header: React.FC<HeaderProps> = ({ name = 'Adrian Hajdin', email = 'adrian@jsmastery.pro', avatarUrl = '/dummyUserImage.png' }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    return (
        <header className="px-8 py-4 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-semibold text-gray-800">Welcome, {name.split(' ')[0]}</h1>
                <p className="text-gray-500 text-sm">Monitor all of your users and books from here</p>
            </div>
            <div className="flex items-center bg-white rounded-full shadow px-1 py-1 gap-3 border border-gray-200">
                <div className="relative">
                    <img src={avatarUrl} alt={name} className="w-9 h-9 rounded-full object-cover" />
                    <span className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div className="flex flex-col justify-center">
                    <span className="font-medium text-gray-800 leading-tight text-sm">{name}</span>
                    <span className="text-xs text-gray-400 -mt-0.5">{email}</span>
                </div>
                <Button variant='ghost' className="ml-2 h-9 w-9 rounded-full" onClick={handleLogout}>
                    <LogOut className="w-5 h-5 text-rose-400" />
                </Button>
            </div>
        </header>
    );
};

export default Header; 