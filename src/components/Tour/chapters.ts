/**
 * Guided tour content for the librarian portal.
 *
 * A chapter is one page's walkthrough. Steps point at elements by their
 * `data-tour="..."` attribute, so markup can move around freely as long as the
 * attribute travels with it. A step whose target is missing from the DOM is
 * skipped automatically — which is what lets the same chapter serve a busy
 * library and one with an empty table. For that to hold, every chapter's
 * `sentinel` must sit on an element that renders even when the page has no
 * data (a wrapper around the list region, not the table itself).
 *
 * Purchase requests are deliberately absent while FEATURES.purchaseRequests
 * is off — add a chapter and nav step here if that flag ever flips back.
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

/** One step per sidebar destination, in the sidebar's own order, so the
 * spotlight walks straight down the menu. Home is skipped — it is where the
 * tour begins. */
export const NAV_STEPS: TourStep[] = [
    {
        id: 'nav-add-book',
        target: 'nav-add-book',
        placement: 'right',
        group: 'nav',
        title: 'Add a book',
        body: 'Register a single new title by hand — cover, copies and shelf details included.',
    },
    {
        id: 'nav-analytics',
        target: 'nav-analytics',
        placement: 'right',
        group: 'nav',
        title: 'Analytics',
        body: 'How the library is being used: popular titles, busy months and the fines picture.',
    },
    {
        id: 'nav-users',
        target: 'nav-users',
        placement: 'right',
        group: 'nav',
        title: 'Your members',
        body: 'Everyone with an account — students, faculty and staff. Search them and change roles.',
    },
    {
        id: 'nav-books',
        target: 'nav-books',
        placement: 'right',
        group: 'nav',
        title: 'Your catalogue',
        body: 'Every book in the library. Add, edit and remove titles, and check how many copies are on the shelf.',
    },
    {
        id: 'nav-borrowed-books',
        target: 'nav-borrowed-books',
        placement: 'right',
        group: 'nav',
        title: 'Books on loan',
        body: 'Every copy currently out. When a book comes back to the desk, you record the return here.',
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
        id: 'nav-renewals',
        target: 'nav-renewals',
        placement: 'right',
        group: 'nav',
        title: 'Renewals',
        body: 'Students can ask for extra time before a book is due. Approve or reject the extension here.',
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
        id: 'nav-bulk-import',
        target: 'nav-bulk-import',
        placement: 'right',
        group: 'nav',
        title: 'Bulk import',
        body: 'Setting up? Load your whole catalogue and member list from CSV files instead of typing them in.',
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
        id: 'analytics',
        label: 'Analytics',
        route: '/analytics',
        sentinel: 'analytics-summary',
        intro: intro('analytics-intro', 'Analytics', 'A picture of how the library is being used.'),
        steps: [
            {
                id: 'analytics-summary',
                target: 'analytics-summary',
                placement: 'bottom',
                group: 'page',
                title: 'The essentials',
                body: 'How many books are overdue, how long books stay out on average, and the fines outstanding.',
            },
            {
                id: 'analytics-top-books',
                target: 'analytics-top-books',
                placement: 'top',
                group: 'page',
                title: "What's popular",
                body: 'The most borrowed titles — useful when deciding what to buy more copies of.',
            },
            {
                id: 'analytics-trend',
                target: 'analytics-trend',
                placement: 'top',
                group: 'page',
                title: 'Borrowing by month',
                body: 'Activity over the last year. Expect peaks around exam season.',
            },
        ],
    },
    {
        id: 'users',
        label: 'Members',
        route: '/users',
        sentinel: 'users-table',
        intro: intro('users-intro', 'Members', 'Everyone with a library account.'),
        steps: [
            {
                id: 'users-search',
                target: 'table-search',
                placement: 'bottom',
                group: 'page',
                title: 'Find a member',
                body: 'Search by name, email or student ID, or filter the list by role.',
            },
            {
                id: 'users-table',
                target: 'users-table',
                placement: 'top',
                group: 'page',
                title: 'Roles set the limits',
                body: 'A member’s role decides how much they can borrow: students take 3 books for 14 days, staff 5 for 21, faculty 10 for 30. Change a role from the actions at the end of a row.',
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
        id: 'borrowed-books',
        label: 'Loans & returns',
        route: '/borrowed-books',
        sentinel: 'borrowed-books-table',
        intro: intro('borrowed-intro', 'Books on loan', 'What is out right now, and how returns are recorded.'),
        steps: [
            {
                id: 'borrowed-books-table',
                target: 'borrowed-books-table',
                placement: 'top',
                group: 'page',
                title: 'Currently out',
                body: 'Every copy on loan and when it is due back. When a student hands a book in, press Returned on its row — a late return raises its fine automatically.',
            },
            {
                id: 'borrow-history',
                target: 'borrow-history',
                placement: 'top',
                group: 'page',
                title: 'Past loans',
                body: 'The full record of books that have already come back.',
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
        id: 'account-requests',
        label: 'Account requests',
        route: '/account-requests',
        sentinel: 'account-requests-table',
        intro: intro('accounts-intro', 'Account requests', 'New signups wait here for your approval.'),
        steps: [
            {
                id: 'account-requests-table',
                target: 'account-requests-table',
                placement: 'top',
                group: 'page',
                title: 'Approve new members',
                body: 'Students appear here once they have verified their email. Approve to activate the account so they can borrow; deny to turn it away.',
            },
        ],
    },
    {
        id: 'renewals',
        label: 'Renewals',
        route: '/renewal-requests',
        sentinel: 'renewals-list',
        intro: intro('renewals-intro', 'Renewal requests', 'Students asking to keep a book a little longer.'),
        steps: [
            {
                id: 'renewals-list',
                target: 'renewals-list',
                placement: 'top',
                group: 'page',
                title: 'Extend, or not',
                body: 'Each request shows the current due date and the one being asked for. Approving moves the due date; rejecting leaves it as it is.',
            },
        ],
    },
    {
        id: 'overdue',
        label: 'Overdue books',
        route: '/overdue',
        sentinel: 'overdue-tabs',
        intro: intro('overdue-intro', 'Overdue books', 'Late books, and the reminders that chase them.'),
        steps: [
            {
                id: 'overdue-stats',
                target: 'overdue-stats',
                placement: 'bottom',
                group: 'page',
                title: 'The two queues',
                body: 'How many books are already late, and how many are due within the next two days.',
            },
            {
                id: 'overdue-tabs',
                target: 'overdue-tabs',
                placement: 'bottom',
                group: 'page',
                title: 'Switch between them',
                body: 'Overdue shows who is late and by how many days; Due Soon shows who to expect at the desk shortly.',
            },
            {
                id: 'overdue-send',
                target: 'overdue-send',
                placement: 'left',
                group: 'page',
                title: 'Reminders',
                body: 'Email and in-app reminders go out automatically every morning. This button sends the same round immediately.',
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
    {
        id: 'bulk-import',
        label: 'Bulk import',
        route: '/bulk-import',
        sentinel: 'import-books',
        intro: intro('import-intro', 'Bulk import', 'The fast way to load a whole library.'),
        steps: [
            {
                id: 'import-books',
                target: 'import-books',
                placement: 'right',
                group: 'page',
                title: 'Books from a spreadsheet',
                body: 'Download the template, fill in one row per title, and drop the file here.',
            },
            {
                id: 'import-users',
                target: 'import-users',
                placement: 'left',
                group: 'page',
                title: 'Members too',
                body: 'Same idea for people. Each imported member’s starting password is their student ID.',
            },
        ],
    },
    {
        id: 'audit',
        label: 'The audit log',
        route: '/audit-logs',
        sentinel: 'audit-filters',
        intro: intro('audit-intro', 'The audit log', 'Every change made in this portal, on the record.'),
        steps: [
            {
                id: 'audit-filters',
                target: 'audit-filters',
                placement: 'bottom',
                group: 'page',
                title: 'Narrow it down',
                body: 'Filter by the kind of action, or by the thing it touched.',
            },
            {
                id: 'audit-table',
                target: 'audit-table',
                placement: 'top',
                group: 'page',
                title: 'Who did what',
                body: 'Each entry records the action, its details and where it came from — the place to look when something seems off.',
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
