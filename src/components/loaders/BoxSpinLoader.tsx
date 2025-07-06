import { memo } from "react"

const BoxSpinLoader = () => {
    return (
        <div className="spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}

export default memo(BoxSpinLoader)