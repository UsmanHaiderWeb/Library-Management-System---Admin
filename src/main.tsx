import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import Test from './components/Test'
import Test2 from './components/Test2'
import IsAuthenticated from './components/IsAuthenticated.tsx'
const App = lazy(() => import('./App.tsx'));
const HomePage = lazy(() => import('./pages/HomePage.tsx'));
const AddNewBookForm = lazy(() => import('./pages/AddNewBookForm.tsx'));
const EditBookForm = lazy(() => import('./pages/EditBookForm.tsx'));
const Login = lazy(() => import('./pages/Auth/Login.tsx'));
const AllBooks = lazy(() => import('./pages/AllBooks.tsx'));
const AllUsers = lazy(() => import('./pages/AllUsers.tsx'));
const AllAccountRequests = lazy(() => import('./pages/AllAccountRequests.tsx'));
const AllBorrowRequests = lazy(() => import('./pages/AllBorrowRequests.tsx'));
const AllPurchaseRequests = lazy(() => import('./pages/AllPurchaseRequests.tsx'));
const BulkImport = lazy(() => import('./pages/BulkImport.tsx'));
const BorrowedBooks = lazy(() => import('./pages/AllBorrowedBooks.tsx'));
const SingleBookDetails = lazy(() => import('./pages/SingleBookDetails.tsx'));
const SingleUserDetails = lazy(() => import('./pages/SingleUserDetails.tsx'));
const Analysis = lazy(() => import('./pages/Analysis.tsx'));
const AllRenewalRequests = lazy(() => import('./pages/AllRenewalRequests.tsx'));
const AllFines = lazy(() => import('./pages/AllFines.tsx'));


const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <IsAuthenticated>
                <App />
            </IsAuthenticated>
        ),
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
            {
                path: '/purchase-requests',
                element: <AllPurchaseRequests />,
            },
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
        ]
    },

    // auth
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/test',
        element: <Test />,
    },
    {
        path: '/test2',
        element: <Test2 />,
    },
])

const queryClient = new QueryClient()

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
