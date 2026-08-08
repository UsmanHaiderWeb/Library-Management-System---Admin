import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000"
});

// Request interceptor: auto-attach admin token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: auto-logout on 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("adminToken");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// ===================== AUTH =====================

export const adminLogin = (data: { email: string; password: string; collegeCode: string }) =>
    api.post("/api/admin/login", data).then(r => r.data);

// ===================== DASHBOARD =====================

export const getDashboardStats = () =>
    api.get("/api/admin/dashboard-stats").then(r => r.data);

export const getBorrowingTrends = (days = 30) =>
    api.get(`/api/admin/borrowing-trends?days=${days}`).then(r => r.data);

export const getAnalytics = () =>
    api.get("/api/admin/analytics").then(r => r.data);

// ===================== BOOKS =====================

export const getAllBooks = (params: { pageNumber: number; searchQuery?: string; fromDate?: string; toDate?: string }) =>
    api.get("/api/admin/getAllBooks", { params }).then(r => r.data);

export const getBookDetails = (bookId: string) =>
    api.get(`/api/books/getBookDetails/${bookId}`).then(r => r.data);

export const createBook = (data: Record<string, unknown>) =>
    api.post("/api/books/create", data).then(r => r.data);

export const updateBook = (bookId: string, data: Record<string, unknown>) =>
    api.post(`/api/books/update/${bookId}`, data).then(r => r.data);

export const deleteBook = (bookId: string) =>
    api.delete(`/api/books/delete/${bookId}`).then(r => r.data);

export const getRecentBooks = () =>
    api.get("/api/admin/getAllBooks?pageNumber=0&searchQuery=").then(r => r.data);

// ===================== IMAGEKIT =====================

export const getImageKitAuth = () =>
    api.get("/api/admin/imagekit-authentication-tokens").then(r => r.data);

// ===================== USERS =====================

export const getAllUsers = (params: { pageNumber: number; searchQuery?: string; role?: string }) =>
    api.get("/api/admin/getAllUsers", { params: { page: params.pageNumber, search: params.searchQuery, role: params.role } }).then(r => r.data);

export const getUserDetails = (userId: string) =>
    api.get(`/api/admin/getUserDetails/${userId}`).then(r => r.data);

export const updateUserRole = (userId: string, role: string) =>
    api.patch(`/api/admin/update-user-role/${userId}`, { role }).then(r => r.data);

// ===================== ACCOUNT VERIFICATION =====================

export const getAllAccountRequests = (params: { pageNumber: number; searchQuery?: string }) =>
    api.get("/api/admin/getAllAccountRequests", { params }).then(r => r.data);

export const approveStudentAccount = (userId: string) =>
    api.post(`/api/admin/verify-account/${userId}`).then(r => r.data);

export const denyStudentAccount = (userId: string) =>
    api.post(`/api/admin/deny-account/${userId}`).then(r => r.data);

// ===================== BORROW MANAGEMENT =====================

export const getAllBorrowRequests = (params: { pageNumber: number; searchQuery?: string; fromDate?: string; toDate?: string }) =>
    api.get("/api/admin/all-borrow-requests", { params }).then(r => r.data);

export const changeBorrowRequestStatus = (borrowRequestId: string, status: string) =>
    api.post(`/api/admin/borrow-requests/change-status/${borrowRequestId}`, { status }).then(r => r.data);

export const getAllBorrowedBooks = (params: { pageNumber: number; searchQuery?: string; fromDate?: string; toDate?: string }) =>
    api.get("/api/admin/borrowed-books/all", { params }).then(r => r.data);

export const getBorrowedBooksHistory = (params: { pageNumber: number; searchQuery?: string; fromDate?: string; toDate?: string }) =>
    api.get("/api/admin/borrowed-books/history", { params }).then(r => r.data);

export const changeReturnStatus = (borrowedBookId: string, status: string) =>
    api.post(`/api/admin/borrowed-books/${borrowedBookId}/change-status`, { status }).then(r => r.data);

// ===================== PURCHASE REQUESTS =====================

export const getAllPurchaseRequests = (params: { pageNumber: number; searchQuery?: string }) =>
    api.get("/api/admin/purchase-requests", { params: { page: params.pageNumber, search: params.searchQuery } }).then(r => r.data);

export const updatePurchaseRequestStatus = (requestId: string, status: string) =>
    api.post(`/api/admin/purchase-requests/${requestId}/status`, { status }).then(r => r.data);

// ===================== RENEWAL REQUESTS =====================

export const getRenewalRequests = (status?: string) =>
    api.get("/api/admin/renewal-requests", { params: { status } }).then(r => r.data);

export const approveRenewal = (requestId: string) =>
    api.post(`/api/admin/renewal-requests/${requestId}/approve`).then(r => r.data);

export const rejectRenewal = (requestId: string) =>
    api.post(`/api/admin/renewal-requests/${requestId}/reject`).then(r => r.data);

// ===================== FINES =====================

export const getAllFines = (pageNumber = 0) =>
    api.get(`/api/admin/fines?pageNumber=${pageNumber}`).then(r => r.data);

// ===================== AUDIT LOGS =====================

export const getAuditLogs = (params: { pageNumber?: number; action?: string; entity?: string }) =>
    api.get("/api/admin/audit-logs", { params }).then(r => r.data);

export const getAuditFilters = () =>
    api.get("/api/admin/audit-logs/filters").then(r => r.data);

// ===================== OVERDUE =====================

export const getOverdueSummary = () =>
    api.get("/api/admin/overdue-summary").then(r => r.data);

export const triggerOverdueReminders = () =>
    api.post("/api/admin/overdue-reminders/trigger").then(r => r.data);

// ===================== BULK IMPORT =====================

export const importBooks = (formData: FormData) =>
    api.post("/api/admin/import/books", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    }).then(r => r.data);

export const importUsers = (formData: FormData) =>
    api.post("/api/admin/import/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    }).then(r => r.data);

// ===================== ADMIN DETAILS =====================

export const getAdminDetails = () =>
    api.get("/api/admin/getAdminDetails").then(r => r.data);
