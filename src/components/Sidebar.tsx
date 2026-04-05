import { NavLink } from 'react-router-dom';
import { Home, Users, BookOpen, ClipboardList, ListTodoIcon, BadgePlus, ShoppingCart, FileUp, BarChart2, UserPlus, RefreshCcw, DollarSign, AlertTriangle, Shield } from 'lucide-react';

interface SidebarProps {
    onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
    return (
        <aside className="h-screen w-72 bg-white border-r flex flex-col py-6 px-4 overflow-y-auto">
            <div className="flex items-center gap-3 mb-4 px-2">
                <div className="bg-blue rounded-full p-2">
                    <BookOpen className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-bluebg-blue">GICCL - Library</span>
            </div>
            <div className="border-b border-dotted border-gray-300 mb-4" />
            <nav className="flex flex-col space-y-1" onClick={onNavigate}>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `text-[15px] flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`
                    }
                >
                    <Home className="w-4 h-4" />
                    Home
                </NavLink>
                <NavLink
                    to="/books/add-new"
                    className={({ isActive }) =>
                        `text-[15px] flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`
                    }
                >
                    <BadgePlus className="w-4 h-4" />
                    Add New Book
                </NavLink>
                <NavLink
                    to="/analytics"
                    className={({ isActive }) =>
                        `text-[15px] flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`
                    }
                >
                    <BarChart2 className="w-4 h-4" />
                    Analysis
                </NavLink>
                <NavLink
                    to="/users"
                    className={({ isActive }) =>
                        `text-[15px] flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`
                    }
                >
                    <Users className="w-4 h-4" />
                    All Users
                </NavLink>
                <NavLink
                    to="/books" end
                    className={({ isActive }) =>
                        `text-[15px] flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`
                    }
                >
                    <BookOpen className="w-4 h-4" />
                    All Books
                </NavLink>
                <NavLink
                    to="/borrowed-books"
                    className={({ isActive }) =>
                        `text-[15px] flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`
                    }
                >
                    <ListTodoIcon className="w-4 h-4" />
                    Borrowed Books
                </NavLink>
                <NavLink
                    to="/borrow-requests"
                    className={({ isActive }) =>
                        `text-[15px] flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`
                    }
                >
                    <ClipboardList className="w-4 h-4" />
                    Borrow Requests
                </NavLink>
                <NavLink
                    to="/account-requests"
                    className={({ isActive }) =>
                        `text-[15px] flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`
                    }
                >
                    <UserPlus className="w-4 h-4" />
                    Account Requests
                </NavLink>
                <NavLink
                    to="/purchase-requests"
                    className={({ isActive }) =>
                        `text-[15px] flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`
                    }
                >
                    <ShoppingCart className="w-4 h-4" />
                    Purchase Requests
                </NavLink>
                <NavLink
                    to="/renewal-requests"
                    className={({ isActive }) =>
                        `text-[15px] flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`
                    }
                >
                    <RefreshCcw className="w-4 h-4" />
                    Renewal Requests
                </NavLink>
                <NavLink
                    to="/overdue"
                    className={({ isActive }) =>
                        `text-[15px] flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`
                    }
                >
                    <AlertTriangle className="w-4 h-4" />
                    Overdue Books
                </NavLink>
                <NavLink
                    to="/fines"
                    className={({ isActive }) =>
                        `text-[15px] flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`
                    }
                >
                    <DollarSign className="w-4 h-4" />
                    Fine History
                </NavLink>
                <NavLink
                    to="/bulk-import"
                    className={({ isActive }) =>
                        `text-[15px] flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`
                    }
                >
                    <FileUp className="w-4 h-4" />
                    Bulk Import
                </NavLink>
                <NavLink
                    to="/audit-logs"
                    className={({ isActive }) =>
                        `text-[15px] flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`
                    }
                >
                    <Shield className="w-4 h-4" />
                    Audit Logs
                </NavLink>
            </nav>
        </aside>
    );
} 