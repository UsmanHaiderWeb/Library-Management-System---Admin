export type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

export interface UserInfoType {
    name: string;
    email: string;
    class: string;
    studentId: string;
    phoneNumber: string;
    borrowedBooks?: string;
    createdAt?: string;
    isEmailVerified?: boolean;
    isVerified?: boolean;
    role?: 'STUDENT' | 'FACULTY' | 'STAFF' | 'ADMIN';
    fineBalance?: number;
    joinedAt?: string;
}

export interface BorrowedBookInterface {
    id: string;
    title: string;
    author: string;
    borrowedBy: UserInfoType;
    borrowedAt: string;
    dueDate: string;
    status: 'borrowed' | 'overdue' | 'returned';
}

export interface BookInterface {
    id: string;
    bookNumber: string;
    bookName: string;
    author: string;
    createdAt: string;
    genre: string;
    almirahNumber: string;
    shelfNumber: string;
    image: string;
    totalBooks: number;
    isOnline: boolean;
    onlineFileUrl?: string;
    _count: {
        BorrowedRequests: string;
        copies: number
    }
}

export interface AllBorrowedBooksTableInterface {
    id: string;
    user: {
        id: string;
        name: string;
        studentId: string;
    }
    bookCopy: {
        book: {
            id: string;
            bookNumber: string;
            bookName: true;
        };
    }
    borrowedOn: string;
    status: "borrowed" | "returned";
    dueDate: string;
    returnedOn: string;
}


export interface AllBorrowRequestsTableInterface {
    id: boolean;
    user: {
        id: boolean;
        name: string;
        studentId: string;
    };
    book: {
        id: boolean;
        bookNumber: string;
        bookName: string;
        author: string;
        genre: string;
    };
    requestedOn: string;
    status: "accepted" | "rejected" | "pending";
}

export interface PurchaseRequestInterface {
    id: string;
    bookName: string;
    author: string;
    reason: string;
    status: "PENDING" | "APPROVED" | "DENIED";
    requestedOn: string;
    user: {
        id: string;
        name: string;
        studentId: string;
    };
}