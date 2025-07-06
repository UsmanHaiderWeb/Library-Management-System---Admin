import { z } from "zod";

export type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

export interface UserInfoType {
    name: string;
    email: string;
    class: string;
    studentId: string;
    phoneNumber: string;
    borrowedBooks?: string;
    createdAt?: string;
    isEmailVerified?: boolean
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

export const taskSchema = z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
    label: z.string(),
    priority: z.string(),
})

export type Task = z.infer<typeof taskSchema>