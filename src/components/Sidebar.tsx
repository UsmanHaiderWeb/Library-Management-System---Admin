import { NavLink } from 'react-router-dom';
import { Home, Users, BookOpen, ClipboardList, UserPlus } from 'lucide-react';

export default function Sidebar() {
    return (
        <aside className="h-screen w-80 bg-white border-r flex flex-col py-6 px-4">
            <div className="flex items-center gap-3 mb-8 px-2">
                <div className="bg-blue rounded-full p-2">
                    <BookOpen className="text-white w-7 h-7" />
                </div>
                <span className="text-2xl font-bold text-bluebg-blue">GICCL -Library</span>
            </div>
            <div className="border-b border-dotted border-gray-300 mb-6" />
            <nav className="flex flex-col gap-2">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`
                    }
                >
                    <Home className="w-5 h-5" />
                    Home
                </NavLink>
                <NavLink
                    to="/users"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`
                    }
                >
                    <Users className="w-5 h-5" />
                    All Users
                </NavLink>
                <NavLink
                    to="/books"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`
                    }
                >
                    <BookOpen className="w-5 h-5" />
                    All Books
                </NavLink>
                <NavLink
                    to="/borrow-requests"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`
                    }
                >
                    <ClipboardList className="w-5 h-5" />
                    Borrow Requests
                </NavLink>
                <NavLink
                    to="/account-requests"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`
                    }
                >
                    <UserPlus className="w-5 h-5" />
                    Account Requests
                </NavLink>
            </nav>
        </aside>
    );
} 