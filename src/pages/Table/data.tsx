import { Badge } from "@/components/ui/badge"
import {
    ArrowDown,
    ArrowRight,
    ArrowUp,
    CheckCircle,
    Circle,
    CircleOff,
    HelpCircle,
    Timer,
} from "lucide-react"

export const labels = [
    {
        value: "bug",
        label: "Bug",
    },
    {
        value: "feature",
        label: "Feature",
    },
    {
        value: "documentation",
        label: "Documentation",
    },
]

export const isEmailVerifiedStatuses = [
    {
        value: true,
        label: (
            <div className="flex space-x-2 justify-end">
                <Badge variant="outline" className='bg-[#ECFDF3] text-green-700'>Verified</Badge>
            </div>
        ),
    },
    {
        value: false,
        label: (
            <div className="flex space-x-2 justify-end">
                <Badge variant="outline" className='bg-pink-50 text-pink-700'>Not Verified</Badge>
            </div>),
    },
]

export const isAvailableStatuses = [
    {
        value: true,
        label: (
            <div className="flex space-x-2 justify-end">
                <Badge variant="outline" className='bg-[#ECFDF3] text-green-700'>Available</Badge>
            </div>
        ),
    },
    {
        value: false,
        label: (
            <div className="flex space-x-2 justify-end">
                <Badge variant="outline" className='bg-pink-50 text-pink-700'>Not Available</Badge>
            </div>),
    },
]

export const statuses = [
    {
        value: "backlog",
        label: "Backlog",
        icon: HelpCircle,
    },
    {
        value: "todo",
        label: "Todo",
        icon: Circle,
    },
    {
        value: "in progress",
        label: "In Progress",
        icon: Timer,
    },
    {
        value: "done",
        label: "Done",
        icon: CheckCircle,
    },
    {
        value: "canceled",
        label: "Canceled",
        icon: CircleOff,
    },
]

export const priorities = [
    {
        label: "Low",
        value: "low",
        icon: ArrowDown,
    },
    {
        label: "Medium",
        value: "medium",
        icon: ArrowRight,
    },
    {
        label: "High",
        value: "high",
        icon: ArrowUp,
    },
]
