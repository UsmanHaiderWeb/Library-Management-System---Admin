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
import { denyStudentAccount } from "@/lib/AxiosCalls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DenyAccountRequestProps {
    userId: string,
    onConfirm?: () => void;
}

function DenyAccountRequest({
    onConfirm,
    userId,
}: DenyAccountRequestProps) {
    const queryClient = useQueryClient();
    const { mutate: denyAccount, isPending } = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem("adminToken") || '';
            if (!token) throw new Error("No authentication token found");
            return denyStudentAccount(userId);
        },
        onSuccess: () => {
            toast.success("Student account request denied successfully");
            queryClient.invalidateQueries({ queryKey: ['all-account-requests'] });
            onConfirm?.();
        },
        onError: (error) => {
            toast.error(error.message || "Failed to deny student account");
        },
    });


    return (
        <Dialog modal={true}>
            <DialogTrigger className="p-0">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.0003 18.9582C5.05866 18.9582 1.04199 14.9415 1.04199 9.99984C1.04199 5.05817 5.05866 1.0415 10.0003 1.0415C14.942 1.0415 18.9587 5.05817 18.9587 9.99984C18.9587 14.9415 14.942 18.9582 10.0003 18.9582ZM10.0003 2.2915C5.75033 2.2915 2.29199 5.74984 2.29199 9.99984C2.29199 14.2498 5.75033 17.7082 10.0003 17.7082C14.2503 17.7082 17.7087 14.2498 17.7087 9.99984C17.7087 5.74984 14.2503 2.2915 10.0003 2.2915Z" fill="#EF3A4B" />
                    <path d="M7.64147 12.9831C7.48314 12.9831 7.3248 12.9248 7.1998 12.7998C6.95814 12.5581 6.95814 12.1581 7.1998 11.9165L11.9165 7.1998C12.1581 6.95814 12.5581 6.95814 12.7998 7.1998C13.0415 7.44147 13.0415 7.84147 12.7998 8.08314L8.08314 12.7998C7.96647 12.9248 7.7998 12.9831 7.64147 12.9831Z" fill="#EF3A4B" />
                    <path d="M12.3581 12.9831C12.1998 12.9831 12.0415 12.9248 11.9165 12.7998L7.1998 8.08314C6.95814 7.84147 6.95814 7.44147 7.1998 7.1998C7.44147 6.95814 7.84147 6.95814 8.08314 7.1998L12.7998 11.9165C13.0415 12.1581 13.0415 12.5581 12.7998 12.7998C12.6748 12.9248 12.5165 12.9831 12.3581 12.9831Z" fill="#EF3A4B" />
                </svg>
            </DialogTrigger>
            <DialogContent
                className="w-sm border-none outline-none"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader className="space-y-4">
                    <div className="mx-auto">
                        <svg width="80" height="80" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle opacity="0.1" cx="55" cy="55" r="55" fill="#F46F70" />
                            <circle cx="55" cy="55" r="40" fill="#F46F70" />
                            <path d="M55.5 68.4375C48.0875 68.4375 42.0625 62.4125 42.0625 55C42.0625 47.5875 48.0875 41.5625 55.5 41.5625C62.9125 41.5625 68.9375 47.5875 68.9375 55C68.9375 62.4125 62.9125 68.4375 55.5 68.4375ZM55.5 43.4375C49.125 43.4375 43.9375 48.625 43.9375 55C43.9375 61.375 49.125 66.5625 55.5 66.5625C61.875 66.5625 67.0625 61.375 67.0625 55C67.0625 48.625 61.875 43.4375 55.5 43.4375Z" fill="white" />
                            <path d="M55.5 57.1875C54.9875 57.1875 54.5625 56.7625 54.5625 56.25V50C54.5625 49.4875 54.9875 49.0625 55.5 49.0625C56.0125 49.0625 56.4375 49.4875 56.4375 50V56.25C56.4375 56.7625 56.0125 57.1875 55.5 57.1875Z" fill="white" />
                            <path d="M55.5 61.2501C55.3375 61.2501 55.175 61.2126 55.025 61.1501C54.875 61.0876 54.7375 61.0001 54.6125 60.8876C54.5 60.7626 54.4125 60.6376 54.35 60.4751C54.2875 60.3251 54.25 60.1626 54.25 60.0001C54.25 59.8376 54.2875 59.6751 54.35 59.5251C54.4125 59.3751 54.5 59.2376 54.6125 59.1126C54.7375 59.0001 54.875 58.9126 55.025 58.8501C55.325 58.7251 55.675 58.7251 55.975 58.8501C56.125 58.9126 56.2625 59.0001 56.3875 59.1126C56.5 59.2376 56.5875 59.3751 56.65 59.5251C56.7125 59.6751 56.75 59.8376 56.75 60.0001C56.75 60.1626 56.7125 60.3251 56.65 60.4751C56.5875 60.6376 56.5 60.7626 56.3875 60.8876C56.2625 61.0001 56.125 61.0876 55.975 61.1501C55.825 61.2126 55.6625 61.2501 55.5 61.2501Z" fill="white" />
                        </svg>
                    </div>
                    <DialogTitle className="text-center text-xl font-semibold">
                        Deny Account Request
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-600">
                        Denying this request will notify the student they&apos;re not eligible due to unsuccessful ID card verification.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="w-full sm:justify-center">
                    {isPending ? (
                        <Button
                            variant="destructive"
                            className="w-full bg-[#F46F70]"
                            disabled
                        >
                            <RefreshCcw className="h-4 w-4 animate-spin" style={{animationDuration: '0.2s'}} />
                        </Button>
                    ) : (
                        <Button
                            variant="destructive"
                            className="w-full bg-[#F46F70]"
                            onClick={() => denyAccount()}
                        >
                            Deny & Notify Student
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default memo(DenyAccountRequest);