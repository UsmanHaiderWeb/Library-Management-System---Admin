/**
 * Guided tour content for the librarian portal.
 *
 * A chapter is one page's walkthrough. Steps point at elements by their
 * `data-tour="..."` attribute, so markup can move around freely as long as the
 * attribute travels with it. A step whose target is missing from the DOM is
 * skipped automatically — which is what lets the same chapter serve a busy
 * library and one with an empty table.
 */

export type TourPlacement = 'top' | 'bottom' | 'left' | 'right' | 'center';

export type TourGroup = 'intro' | 'nav' | 'page';

export type TourStep = {
    id: string;
    /** `data-tour` value of the element to highlight, or null for a centred card. */
    target: string | null;
    title: string;
    body: string;
    placement: TourPlacement;
    group: TourGroup;
};

export type TourChapter = {
    id: string;
    label: string;
    route: string;
    /** Match any route starting with `route`. */
    matchPrefix?: boolean;
    /** Element that must exist before the chapter may start — proves the page rendered. */
    sentinel: string;
    intro: TourStep;
    steps: TourStep[];
};

const intro = (id: string, title: string, body: string): TourStep => ({
    id,
    target: null,
    placement: 'center',
    group: 'intro',
    title,
    body,
});

/** Shown once, alongside whichever chapter runs first. */
export const NAV_PROGRESS_KEY = 'nav';

export const NAV_STEPS: TourStep[] = [
    {
        id: 'nav-books',
        target: 'nav-books',
        placement: 'right',
        group: 'nav',
        title: 'Your catalogue',
        body: 'Every book in the library. Add, edit and remove titles, and check how many copies are on the shelf.',
    },
    {
        id: 'nav-borrow-requests',
        target: 'nav-borrow-requests',
        placement: 'right',
        group: 'nav',
        title: 'Borrow requests',
        body: 'Students request a book here and you approve or reject it. Approving assigns them a copy and sets the due date.',
    },
    {
        id: 'nav-account-requests',
        target: 'nav-account-requests',
        placement: 'right',
        group: 'nav',
        title: 'Account requests',
        body: 'New students appear here once they verify their email. They cannot borrow until you approve them.',
    },
    {
        id: 'nav-overdue',
        target: 'nav-overdue',
        placement: 'right',
        group: 'nav',
        title: 'Overdue books',
        body: 'Who is late and who is due soon. Reminders go out automatically every morning, and you can send them early from here.',
    },
    {
        id: 'nav-fines',
        target: 'nav-fines',
        placement: 'right',
        group: 'nav',
        title: 'Fines',
        body: 'Late returns are charged automatically. Students pay in cash at the desk and you record it here.',
    },
    {
        id: 'nav-audit',
        target: 'nav-audit',
        placement: 'right',
        group: 'nav',
        title: 'Audit log',
        body: 'A record of every change made in this portal and who made it — useful when something looks wrong.',
    },
];

export const CHAPTERS: TourChapter[] = [
    {
        id: 'dashboard',
        label: 'The dashboard',
        route: '/',
        sentinel: 'dashboard-stats',
        intro: intro(
            'dashboard-intro',
            'Welcome to the librarian portal',
            'A short tour of how the library runs from here. About a minute, and you can leave at any point.',
        ),
        steps: [
            {
                id: 'dashboard-stats',
                target: 'dashboard-stats',
                placement: 'bottom',
                group: 'page',
                title: 'Today at a glance',
                body: 'Total books and students, requests waiting on you, and how many books are currently out on loan.',
            },
            {
                id: 'dashboard-trends',
                target: 'dashboard-trends',
                placement: 'top',
                group: 'page',
                title: 'Borrowing over time',
                body: 'Daily borrowing for the last month — handy for spotting exam-season peaks.',
            },
            {
                id: 'dashboard-quick-actions',
                target: 'dashboard-quick-actions',
                placement: 'left',
                group: 'page',
                title: 'Jump to what needs you',
                body: 'Shortcuts to the queues that usually need attention: approvals, overdue books, renewals and fines.',
            },
        ],
    },
    {
        id: 'books',
        label: 'Managing books',
        route: '/books',
        sentinel: 'books-table',
        intro: intro('books-intro', 'The catalogue', 'Finding, adding and editing books.'),
        steps: [
            {
                id: 'books-search',
                target: 'table-search',
                placement: 'bottom',
                group: 'page',
                title: 'Find a book',
                body: 'Search by title, author, ISBN or book number.',
            },
            {
                id: 'books-table',
                target: 'books-table',
                placement: 'top',
                group: 'page',
                title: 'The catalogue',
                body: 'Each row shows copies and availability. Use the actions at the end of a row to edit or remove a title.',
            },
        ],
    },
    {
        id: 'borrow-requests',
        label: 'Approving requests',
        route: '/borrow-requests',
        sentinel: 'borrow-requests-table',
        intro: intro(
            'borrow-intro',
            'Borrow requests',
            'This is the queue you will use most often.',
        ),
        steps: [
            {
                id: 'borrow-requests-table',
                target: 'borrow-requests-table',
                placement: 'top',
                group: 'page',
                title: 'Approve or reject',
                body: 'Approving hands the student a copy and starts the loan; the due date follows their role — 14 days for students, 30 for faculty.',
            },
        ],
    },
    {
        id: 'fines',
        label: 'Recording payments',
        route: '/fines',
        sentinel: 'fines-table',
        intro: intro(
            'fines-intro',
            'Fines',
            'Fines are raised automatically on a late return — ₹10 per day.',
        ),
        steps: [
            {
                id: 'fines-table',
                target: 'fines-table',
                placement: 'top',
                group: 'page',
                title: 'Settle at the desk',
                body: 'There is no online payment. When a student pays cash, mark it paid here; use waive if you are letting it go. Either way the student is notified and their balance clears.',
            },
        ],
    },
];

export const DEFAULT_CHAPTER_ID = 'dashboard';

export const chapterById = (id: string): TourChapter | null =>
    CHAPTERS.find((chapter) => chapter.id === id) ?? null;

export const chapterMatchesRoute = (chapter: TourChapter, pathname: string): boolean =>
    chapter.matchPrefix ? pathname.startsWith(chapter.route) : pathname === chapter.route;

export const chapterForRoute = (pathname: string): TourChapter | null =>
    CHAPTERS.find((chapter) => chapterMatchesRoute(chapter, pathname)) ?? null;

/** The sidebar only exists once signed in. */
export const isNavTourAllowed = (pathname: string): boolean => pathname !== '/login';
