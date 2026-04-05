import { memo } from "react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { RefreshCcw } from "lucide-react";
import { approveStudentAccount } from "@/lib/AxiosCalls";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface ApproveAccountRequestProps {
    studentId: string,
    onConfirm?: () => void;
}

function ApproveAccountRequest({
    onConfirm,
    studentId,
}: ApproveAccountRequestProps) {
    const { mutate: approveAccount, isPending } = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem("adminToken") || '';
            if (!token) throw new Error("No authentication token found");
            return approveStudentAccount(studentId);
        },
        onSuccess: () => {
            toast.success("Student account request approved successfully");
            onConfirm?.();
        },
        onError: (error) => {
            toast.error(error.message || "Failed to approve student account");
        },
    });

    return (
        <Dialog modal={true}>
            <DialogTrigger className="p-0">
                <span className="bg-green-100 hover:bg-green-200 text-green-700 text-xs px-3 py-1 rounded-sm">Approve</span>
            </DialogTrigger>
            <DialogContent
                className="w-sm border-none outline-none"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader className="space-y-4">
                    <div className="mx-auto">
                        <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle opacity="0.1" cx="55" cy="55" r="55" fill="#4CAF50" />
                            <circle cx="55" cy="55" r="40" fill="#4CAF50" />
                            <path d="M55 68.4375C47.5875 68.4375 41.5625 62.4125 41.5625 55C41.5625 47.5875 47.5875 41.5625 55 41.5625C62.4125 41.5625 68.4375 47.5875 68.4375 55C68.4375 62.4125 62.4125 68.4375 55 68.4375ZM55 43.4375C48.625 43.4375 43.4375 48.625 43.4375 55C43.4375 61.375 48.625 66.5625 55 66.5625C61.375 66.5625 66.5625 61.375 66.5625 55C66.5625 48.625 61.375 43.4375 55 43.4375Z" fill="white" />
                            <path d="M53.2258 59.4745C52.9758 59.4745 52.7383 59.3745 52.5633 59.1995L49.0258 55.662C48.6633 55.2995 48.6633 54.6995 49.0258 54.337C49.3883 53.9745 49.9883 53.9745 50.3508 54.337L53.2258 57.212L59.6508 50.787C60.0133 50.4245 60.6133 50.4245 60.9758 50.787C61.3383 51.1495 61.3383 51.7495 60.9758 52.112L53.8883 59.1995C53.7133 59.3745 53.4758 59.4745 53.2258 59.4745Z" fill="white" />
                        </svg>
                    </div>
                    <DialogTitle className="text-center text-xl font-semibold">
                        Approve Book Request
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-600">
                        Approving this request will grant access and send a confirmation email to the student.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="w-full sm:justify-center">
                    {isPending ? (
                        <Button
                            variant="default"
                            className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white"
                            disabled
                        >
                            <RefreshCcw className="h-4 w-4 animate-spin" style={{ animationDuration: '0.2s' }} />
                        </Button>
                    ) : (
                        <Button
                            variant="default"
                            className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white"
                            onClick={() => approveAccount()}
                        >
                            Approve Account
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default memo(ApproveAccountRequest);