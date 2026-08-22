import { FEATURES } from '@/lib/features';
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import IsAuthenticated from './components/IsAuthenticated.tsx'
import RouteError from './components/RouteError.tsx'
import { lazyWithReload } from './lib/lazyWithReload.ts'
const App = lazyWithReload(() => import('./App.tsx'));
const HomePage = lazyWithReload(() => import('./pages/HomePage.tsx'));
const AddNewBookForm = lazyWithReload(() => import('./pages/AddNewBookForm.tsx'));
const EditBookForm = lazyWithReload(() => import('./pages/EditBookForm.tsx'));
const Login = lazyWithReload(() => import('./pages/Auth/Login.tsx'));
const AllBooks = lazyWithReload(() => import('./pages/AllBooks.tsx'));
const AllUsers = lazyWithReload(() => import('./pages/AllUsers.tsx'));
const AllAccountRequests = lazyWithReload(() => import('./pages/AllAccountRequests.tsx'));
const AllBorrowRequests = lazyWithReload(() => import('./pages/AllBorrowRequests.tsx'));
const AllPurchaseRequests = lazyWithReload(() => import('./pages/AllPurchaseRequests.tsx'));
const BulkImport = lazyWithReload(() => import('./pages/BulkImport.tsx'));
const BorrowedBooks = lazyWithReload(() => import('./pages/AllBorrowedBooks.tsx'));
const SingleBookDetails = lazyWithReload(() => import('./pages/SingleBookDetails.tsx'));
const SingleUserDetails = lazyWithReload(() => import('./pages/SingleUserDetails.tsx'));
const Analysis = lazyWithReload(() => import('./pages/Analysis.tsx'));
const AllRenewalRequests = lazyWithReload(() => import('./pages/AllRenewalRequests.tsx'));
const AllFines = lazyWithReload(() => import('./pages/AllFines.tsx'));
const OverdueBooks = lazyWithReload(() => import('./pages/OverdueBooks.tsx'));
const AuditLogs = lazyWithReload(() => import('./pages/AuditLogs.tsx'));


const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <IsAuthenticated>
                <App />
            </IsAuthenticated>
        ),
        // Catches route errors from every child, chunk failures after a
        // deployment above all
        errorElement: <RouteError />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/borrowed-books',
                element: <BorrowedBooks />,
            },
            {
                path: '/books',
                element: <AllBooks />,
            },
            {
                path: '/users',
                element: <AllUsers />,
            },
            {
                path: '/account-requests',
                element: <AllAccountRequests />,
            },
            {
                path: '/borrow-requests',
                element: <AllBorrowRequests />,
            },
            // Purchase requests are switched off for now; the page is kept so
            // flipping FEATURES.purchaseRequests brings it straight back.
            ...(FEATURES.purchaseRequests ? [{
                path: '/purchase-requests',
                element: <AllPurchaseRequests />,
            }] : []),
            {
                path: '/bulk-import',
                element: <BulkImport />,
            },
            {
                path: '/books/add-new',
                element: <AddNewBookForm />,
            },
            {
                path: '/books/edit/:bookId',
                element: <EditBookForm />,
            },
            {
                path: '/books/:id',
                element: <SingleBookDetails />,
            },
            {
                path: '/users/:userId',
                element: <SingleUserDetails />,
            },
            {
                path: '/analytics',
                element: <Analysis />,
            },
            {
                path: '/renewal-requests',
                element: <AllRenewalRequests />,
            },
            {
                path: '/fines',
                element: <AllFines />,
            },
            {
                path: '/overdue',
                element: <OverdueBooks />,
            },
            {
                path: '/audit-logs',
                element: <AuditLogs />,
            },
        ]
    },

    // auth
    {
        errorElement: <RouteError />,
        path: '/login',
        element: <Login />,
    },
])

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Refetching every time the tab regains focus caused a burst of
            // requests just for alt-tabbing. Data here is not volatile enough
            // to need it; pages that mutate invalidate their own queries.
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            staleTime: 1000 * 60 * 5,
            retry: 1,
        },
    },
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <main>
                <Suspense fallback={<div></div>}>
                    <RouterProvider router={router} />
                </Suspense>
            </main>
        </QueryClientProvider>
    </StrictMode>,
)
