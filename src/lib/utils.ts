import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BorrowedBookInterface, UserInfoType } from "./types&interfaces"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const tasks = [
    {
        id: "TASK-8782",
        title: "You can't compress the program without quantifying the open-source SSD pixel!",
        status: "in progress",
        label: "documentation",
        priority: "medium"
    },
    {
        id: "TASK-7878",
        title: "Try to calculate the EXE feed, maybe it will index the multi-byte pixel!",
        status: "backlog",
        label: "documentation",
        priority: "medium"
    },
    {
        id: "TASK-7839",
        title: "We need to bypass the neural TCP card!",
        status: "todo",
        label: "bug",
        priority: "high"
    },
    {
        id: "TASK-5562",
        title: "The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!",
        status: "backlog",
        label: "feature",
        priority: "medium"
    },
    {
        id: "TASK-8686",
        title: "I'll parse the wireless SSL protocol, that should driver the API panel!",
        status: "canceled",
        label: "feature",
        priority: "medium"
    },
    {
        id: "TASK-1280",
        title: "Use the digital TLS panel, then you can transmit the haptic system!",
        status: "done",
        label: "bug",
        priority: "high"
    },
    {
        id: "TASK-7262",
        title: "The UTF8 application is down, parse the neural bandwidth so we can back up the PNG firewall!",
        status: "done",
        label: "feature",
        priority: "high"
    },
]

export const users: UserInfoType[] = [
    {
        name: "John Smith",
        email: "john.smith@email.com",
        class: "Computer Science",
        studentId: "CS2023001",
        phoneNumber: "555-0101",
        borrowedBooks: "2",
        joinedAt: "15/01/2023",
        isVerified: true
    },
    {
        name: "Emma Johnson",
        email: "emma.j@email.com",
        class: "Mathematics",
        studentId: "MATH2023002",
        phoneNumber: "555-0102",
        borrowedBooks: "1",
        joinedAt: "20/01/2023",
        isVerified: true
    },
    {
        name: "Michael Brown",
        email: "m.brown@email.com",
        class: "Physics",
        studentId: "PHY2023003",
        phoneNumber: "555-0103",
        borrowedBooks: "3",
        joinedAt: "01/02/2023",
        isVerified: false
    },
    {
        name: "Sarah Davis",
        email: "s.davis@email.com",
        class: "Computer Science",
        studentId: "CS2023004",
        phoneNumber: "555-0104",
        borrowedBooks: "0",
        joinedAt: "15/02/2023",
        isVerified: true
    },
    {
        name: "James Wilson",
        email: "j.wilson@email.com",
        class: "Engineering",
        studentId: "ENG2023005",
        phoneNumber: "555-0105",
        borrowedBooks: "1",
        joinedAt: "01/03/2023",
        isVerified: true
    },
    {
        name: "Lisa Anderson",
        email: "l.anderson@email.com",
        class: "Biology",
        studentId: "BIO2023006",
        phoneNumber: "555-0106",
        borrowedBooks: "2",
        joinedAt: "15/03/2023",
        isVerified: false
    },
    {
        name: "Robert Taylor",
        email: "r.taylor@email.com",
        class: "Chemistry",
        studentId: "CHEM2023007",
        phoneNumber: "555-0107",
        borrowedBooks: "1",
        joinedAt: "01/04/2023",
        isVerified: true
    },
    {
        name: "Jennifer Martinez",
        email: "j.martinez@email.com",
        class: "Computer Science",
        studentId: "CS2023008",
        phoneNumber: "555-0108",
        borrowedBooks: "3",
        joinedAt: "15/04/2023",
        isVerified: true
    },
    {
        name: "David Thompson",
        email: "d.thompson@email.com",
        class: "Mathematics",
        studentId: "MATH2023009",
        phoneNumber: "555-0109",
        borrowedBooks: "0",
        joinedAt: "01/05/2023",
        isVerified: false
    },
    {
        name: "Patricia Garcia",
        email: "p.garcia@email.com",
        class: "Physics",
        studentId: "PHY2023010",
        phoneNumber: "555-0110",
        borrowedBooks: "2",
        joinedAt: "15/05/2023",
        isVerified: true
    },
    {
        name: "William Robinson",
        email: "w.robinson@email.com",
        class: "Engineering",
        studentId: "ENG2023011",
        phoneNumber: "555-0111",
        borrowedBooks: "1",
        joinedAt: "01/06/2023",
        isVerified: true
    },
    {
        name: "Elizabeth Clark",
        email: "e.clark@email.com",
        class: "Biology",
        studentId: "BIO2023012",
        phoneNumber: "555-0112",
        borrowedBooks: "3",
        joinedAt: "15/06/2023",
        isVerified: false
    },
    {
        name: "Richard Rodriguez",
        email: "r.rodriguez@email.com",
        class: "Chemistry",
        studentId: "CHEM2023013",
        phoneNumber: "555-0113",
        borrowedBooks: "0",
        joinedAt: "01/07/2023",
        isVerified: true
    },
    {
        name: "Susan Lewis",
        email: "s.lewis@email.com",
        class: "Computer Science",
        studentId: "CS2023014",
        phoneNumber: "555-0114",
        borrowedBooks: "2",
        joinedAt: "15/07/2023",
        isVerified: true
    },
    {
        name: "Joseph Lee",
        email: "j.lee@email.com",
        class: "Mathematics",
        studentId: "MATH2023015",
        phoneNumber: "555-0115",
        borrowedBooks: "1",
        joinedAt: "01/08/2023",
        isVerified: false
    },
    {
        name: "Margaret Walker",
        email: "m.walker@email.com",
        class: "Physics",
        studentId: "PHY2023016",
        phoneNumber: "555-0116",
        borrowedBooks: "3",
        joinedAt: "15/08/2023",
        isVerified: true
    },
    {
        name: "Charles Hall",
        email: "c.hall@email.com",
        class: "Engineering",
        studentId: "ENG2023017",
        phoneNumber: "555-0117",
        borrowedBooks: "0",
        joinedAt: "01/09/2023",
        isVerified: true
    },
    {
        name: "Jessica Allen",
        email: "j.allen@email.com",
        class: "Biology",
        studentId: "BIO2023018",
        phoneNumber: "555-0118",
        borrowedBooks: "2",
        joinedAt: "15/09/2023",
        isVerified: false
    },
    {
        name: "Thomas Young",
        email: "t.young@email.com",
        class: "Chemistry",
        studentId: "CHEM2023019",
        phoneNumber: "555-0119",
        borrowedBooks: "1",
        joinedAt: "01/10/2023",
        isVerified: true
    },
    {
        name: "Nancy King",
        email: "n.king@email.com",
        class: "Computer Science",
        studentId: "CS2023020",
        phoneNumber: "555-0120",
        borrowedBooks: "3",
        joinedAt: "15/10/2023",
        isVerified: true
    }
];


export const borrowedBooks: BorrowedBookInterface[] = [
    {
        id: "BB001",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        borrowedBy: users[0],
        borrowedAt: "01/01/2024",
        dueDate: "15/01/2024",
        status: "borrowed"
    },
    {
        id: "BB002",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        borrowedBy: users[1],
        borrowedAt: "05/01/2024",
        dueDate: "20/01/2024",
        status: "borrowed"
    },
    {
        id: "BB003",
        title: "1984",
        author: "George Orwell",
        borrowedBy: users[2],
        borrowedAt: "10/01/2024",
        dueDate: "25/01/2024",
        status: "overdue"
    },
    {
        id: "BB004",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        borrowedBy: users[3],
        borrowedAt: "15/01/2024",
        dueDate: "30/01/2024",
        status: "borrowed"
    },
    {
        id: "BB005",
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        borrowedBy: users[4],
        borrowedAt: "20/01/2024",
        dueDate: "04/02/2024",
        status: "borrowed"
    },
    {
        id: "BB006",
        title: "Lord of the Flies",
        author: "William Golding",
        borrowedBy: users[5],
        borrowedAt: "25/01/2024",
        dueDate: "09/02/2024",
        status: "borrowed"
    },
    {
        id: "BB007",
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        borrowedBy: users[6],
        borrowedAt: "30/01/2024",
        dueDate: "14/02/2024",
        status: "borrowed"
    },
    {
        id: "BB008",
        title: "Fahrenheit 451",
        author: "Ray Bradbury",
        borrowedBy: users[7],
        borrowedAt: "01/02/2024",
        dueDate: "16/02/2024",
        status: "borrowed"
    },
    {
        id: "BB009",
        title: "The Alchemist",
        author: "Paulo Coelho",
        borrowedBy: users[8],
        borrowedAt: "05/02/2024",
        dueDate: "20/02/2024",
        status: "borrowed"
    },
    {
        id: "BB010",
        title: "The Little Prince",
        author: "Antoine de Saint-Exupéry",
        borrowedBy: users[9],
        borrowedAt: "10/02/2024",
        dueDate: "25/02/2024",
        status: "borrowed"
    },
    {
        id: "BB011",
        title: "The Kite Runner",
        author: "Khaled Hosseini",
        borrowedBy: users[10],
        borrowedAt: "15/02/2024",
        dueDate: "01/03/2024",
        status: "borrowed"
    },
    {
        id: "BB012",
        title: "The Book Thief",
        author: "Markus Zusak",
        borrowedBy: users[11],
        borrowedAt: "20/02/2024",
        dueDate: "06/03/2024",
        status: "borrowed"
    },
    {
        id: "BB013",
        title: "The Da Vinci Code",
        author: "Dan Brown",
        borrowedBy: users[12],
        borrowedAt: "25/02/2024",
        dueDate: "11/03/2024",
        status: "borrowed"
    },
    {
        id: "BB014",
        title: "The Hunger Games",
        author: "Suzanne Collins",
        borrowedBy: users[13],
        borrowedAt: "01/03/2024",
        dueDate: "16/03/2024",
        status: "borrowed"
    },
    {
        id: "BB015",
        title: "The Fault in Our Stars",
        author: "John Green",
        borrowedBy: users[14],
        borrowedAt: "05/03/2024",
        dueDate: "20/03/2024",
        status: "borrowed"
    },
    {
        id: "BB016",
        title: "The Giver",
        author: "Lois Lowry",
        borrowedBy: users[15],
        borrowedAt: "10/03/2024",
        dueDate: "25/03/2024",
        status: "borrowed"
    },
    {
        id: "BB017",
        title: "The Help",
        author: "Kathryn Stockett",
        borrowedBy: users[16],
        borrowedAt: "15/03/2024",
        dueDate: "30/03/2024",
        status: "borrowed"
    },
    {
        id: "BB018",
        title: "The Secret Life of Bees",
        author: "Sue Monk Kidd",
        borrowedBy: users[17],
        borrowedAt: "20/03/2024",
        dueDate: "04/04/2024",
        status: "borrowed"
    },
    {
        id: "BB019",
        title: "The Curious Incident of the Dog in the Night-Time",
        author: "Mark Haddon",
        borrowedBy: users[18],
        borrowedAt: "25/03/2024",
        dueDate: "09/04/2024",
        status: "borrowed"
    },
    {
        id: "BB020",
        title: "The Perks of Being a Wallflower",
        author: "Stephen Chbosky",
        borrowedBy: users[19],
        borrowedAt: "30/03/2024",
        dueDate: "14/04/2024",
        status: "borrowed"
    }
];