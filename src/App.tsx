import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import { Toaster } from 'sonner'

const App = () => {
    return (
        <div className='bg-bg flex relative'>
            <Toaster position="bottom-right" />
            <div className='sticky top-0 left-0 h-full'>
                <Sidebar />
            </div>
            <div className='flex-1 lg:max-w-[calc(100vw-275px)] max-w-full overflow-hidden'>
                <Header />
                <Outlet />
            </div>
        </div>
    )
}

export default memo(App)