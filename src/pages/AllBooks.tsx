import { memo, useState } from "react"
import { columns } from "./Table/columns"
import { DataTable } from "./Table/data-table"
import { tasks } from "@/lib/utils"

function AllBooks() {
    const [pageNumber, setPageNumber] = useState(0);

    return (
        <div className="px-7 w-full">
            <DataTable data={[tasks[pageNumber]]} columns={columns} pageNumber={pageNumber} setPageNumber={setPageNumber} />
        </div>
    )
}
export default memo(AllBooks)