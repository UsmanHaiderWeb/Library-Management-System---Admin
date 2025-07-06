import { memo, useState } from "react"
import { borrowedBooksColumns } from "./Table/columns"
import { DataTable } from "./Table/data-table"
import { borrowedBooks } from "@/lib/utils"

function BorrowRequests() {
    const [pageNumber, setPageNumber] = useState(0);

    return (
        <div className="px-7 w-full">
            <DataTable data={borrowedBooks.slice(0, pageNumber)} columns={borrowedBooksColumns} pageNumber={pageNumber} setPageNumber={setPageNumber} totalPages={borrowedBooks.length - 1} />
        </div>
)
}
export default memo(BorrowRequests)