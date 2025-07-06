import { memo, useState } from "react"
import { requestedAccountColumns } from "./Table/columns"
import { DataTable } from "./Table/data-table"
import { users } from "@/lib/utils";

function AllAccountRequests() {
    const [pageNumber, setPageNumber] = useState(0);

    return (
        <div className="px-7 w-full">
            <DataTable data={[users?.[pageNumber]]} columns={requestedAccountColumns} pageNumber={pageNumber} setPageNumber={setPageNumber} />
        </div>
    )
}
export default memo(AllAccountRequests)