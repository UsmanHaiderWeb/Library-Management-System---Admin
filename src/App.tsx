import { memo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import { Toaster } from 'sonner'
import TourProvider from './components/Tour/TourProvider'

const App = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        // Inside the router so the tour can react to the current route
        <TourProvider>
        <div className='bg-bg flex relative'>
            <Toaster position="bottom-right" />

            {/* Desktop sidebar */}
            <div className='hidden lg:block sticky top-0 left-0 h-full'>
                <Sidebar />
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile sidebar drawer */}
            <div
                className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 lg:hidden ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <Sidebar onNavigate={() => setSidebarOpen(false)} />
            </div>

            <div className='flex-1 lg:max-w-[calc(100vw-275px)] max-w-full overflow-hidden'>
                <Header onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
                <Outlet />
            </div>
        </div>
        </TourProvider>
    )
}

export default memo(App)
