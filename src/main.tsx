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
const Login = lazy(() => import('./pages/Auth/Login.tsx'));
const AllBooks = lazy(() => import('./pages/AllBooks.tsx'));
const AllUsers = lazy(() => import('./pages/AllUsers.tsx'));
const AllAccountRequests = lazy(() => import('./pages/AllAccountRequests.tsx'));
const BorrowRequests = lazy(() => import('./pages/BorrowRequests.tsx'));
const BorrowedBooks = lazy(() => import('./pages/BorrowedBooks.tsx'));
const SingleBookDetails = lazy(() => import('./pages/SingleBookDetails.tsx'));
const SingleUserDetails = lazy(() => import('./pages/SingleUserDetails.tsx'));


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
                path: '/borrow-books',
                element: <BorrowedBooks />,
            },
            {
                path: '/borrow-requests',
                element: <BorrowRequests />,
            },
            {
                path: '/books/add-new',
                element: <AddNewBookForm />,
            },
            {
                path: '/books/:id',
                element: <SingleBookDetails />,
            },
            {
                path: '/users/:userId',
                element: <SingleUserDetails />,
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
