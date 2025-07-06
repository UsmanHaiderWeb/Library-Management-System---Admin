import { memo, useState } from "react"
import { borrowedBooksColumns } from "./Table/columns"
import { DataTable } from "./Table/data-table"
import { borrowedBooks } from "@/lib/utils"

function BorrowedBooks() {
    const [pageNumber, setPageNumber] = useState(0);

    return (
        <div className="pb-10">
            <div className="px-7 w-full pt-5">
                <h1 className="text-3xl font-semibold tracking-tight mb-4 pl-1">Borrowed Books</h1>
                <DataTable
                    data={borrowedBooks.slice(0, pageNumber)}
                    columns={borrowedBooksColumns}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    totalPages={borrowedBooks.length - 1}
                    placeHolder="Find books by name"
                />
            </div>
            <div className="px-7 w-full pt-5">
                <h1 className="text-3xl font-semibold tracking-tight mb-4 pl-1">History</h1>
                <DataTable
                    data={borrowedBooks.slice(0, pageNumber)}
                    columns={borrowedBooksColumns}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    totalPages={borrowedBooks.length - 1}
                    placeHolder="Find books by name"
                />
            </div>
        </div>
    )
}
export default memo(BorrowedBooks)