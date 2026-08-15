# Admin Portal — Agent Guide

React 19 + Vite + Tailwind 4 + Radix, TanStack Query for all server state. Librarian-facing. See root `../CLAUDE.md` for system-wide rules.

## API layer (the one place that matters)

`src/lib/AxiosCalls.ts` exports the `api` axios instance plus named helpers for every endpoint. **The baseURL is empty**: calls go to the origin serving the portal and the proxy in front forwards `/api` (and `/templates`) to the backend — Vite's `server.proxy` in development, Caddy in production. So the portal is always same-origin with its API, CORS never applies to it, and a new install needs no source edit. `VITE_API_BASE_URL` overrides this only if the API genuinely lives on another origin. Interceptors: auto-attach `Bearer` from `localStorage.adminToken`; auto-logout + redirect `/login` on 401. Keep every new call in this file or on this instance — no raw axios in components.

Auth token key is **`adminToken`** (the Student portal uses `token` — do not mix them up; this exact confusion caused past bugs).

## Pages ↔ routes (defined in `src/main.tsx`, guarded by `IsAuthenticated`)

| Route | Page | Notes |
|-------|------|-------|
| `/` | `HomePage` | stats cards, real borrowing-trends chart, recent books (`/api/admin/getAllBooks`) |
| `/books`, `/books/add-new`, `/books/edit/:bookId`, `/books/:id` | `AllBooks`, forms, `SingleBookDetails` | |
| `/users`, `/users/:userId` | `AllUsers`, `SingleUserDetails` | roles: STUDENT/FACULTY/STAFF only — **no ADMIN UserRole exists** |
| `/account-requests` | `AllAccountRequests` | uses `requestedAccountColumns`; Approve/Deny post the DB `id` (not `studentId`) |
| `/borrow-requests`, `/borrowed-books` | request/loan management | |
| `/purchase-requests` | `AllPurchaseRequests` | status enum `PENDING/APPROVED/REJECTED` (**never DENIED**) |
| `/renewal-requests` | `AllRenewalRequests` | rows use `id` (not `_id`) |
| `/fines` | `AllFines` | offline settlement: Mark Paid / Waive → `PATCH /api/admin/fines/:id/pay|waive` |
| `/overdue` | `OverdueBooks` | stats + manual reminder trigger |
| `/analytics` | `Analysis` | keys: `topBorrowedBooks[].borrowCount`, `topActiveUsers[].{studentId,borrowCount}`, `fineStats.totalFines` |
| `/audit-logs` | `AuditLogs` | |
| `/bulk-import` | `BulkImport` | CSV, templates in `public/` |

## Table architecture

`src/pages/Table/data-table.tsx` is the generic TanStack table (search, pagination, faceted filters from `Table/data.tsx`). **All column defs live in `src/pages/Table/columns.tsx`** (large file) — action components (mutations, dialogs) are defined alongside their columns.

## Gotchas

- Backend list responses are flat DTOs with `{ items, totalPages, totalCount }` — when adding a page, verify the exact field names against the backend service before writing the interface.
- Dates from the API can be null (`dueDate` especially) — guard before `format()`/`new Date()`.
- After a mutation, invalidate the page's query key (`queryClient.invalidateQueries`).
- No test setup exists in this repo (known gap).
