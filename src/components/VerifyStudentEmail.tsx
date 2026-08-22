import { memo, useState } from "react";
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
import { RefreshCcw, MailCheck } from "lucide-react";
import { verifyStudentEmail } from "@/lib/AxiosCalls";
import { useOptimisticRowMutation } from "@/lib/optimisticRow";

interface Props {
    userId: string;
    email?: string;
}

/**
 * Lets a librarian confirm a student's email when the code cannot reach them —
 * a mistyped address, a mail server eating it, an account created at the desk.
 *
 * Worth knowing: students who have not verified never appear under Account
 * Requests, because that list only includes already-verified emails. This page
 * is the only place they are visible, which is why the action lives here.
 */
function VerifyStudentEmail({ userId, email }: Props) {
    // Controlled so the dialog can be closed once the action has
    // been taken. It used to have no open prop at all, so it simply
    // stayed put after a successful approval.
    const [open, setOpen] = useState(false);


    const { mutate, isPending } = useOptimisticRowMutation<unknown, void, { id: string; isEmailVerified: boolean }>({
        onStart: () => setOpen(false),
        mutationFn: () => verifyStudentEmail(userId),
        queryKey: ['users'],
        matches: (row) => row.id === userId,
        // The badge and this button both key off isEmailVerified, so the row
        // settles into its verified state without waiting for a refetch
        update: { patch: (row) => ({ ...row, isEmailVerified: true }) },
        successMessage: "Email verified. The student can borrow once their account is approved.",
        errorMessage: "Failed to verify this email",
        alsoInvalidate: [['all-account-requests'], ['dashboard-stats']],
    });

    return (
        <Dialog modal={true} open={open} onOpenChange={setOpen}>
            <DialogTrigger className="p-0">
                <span className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-sm whitespace-nowrap">
                    Verify
                </span>
            </DialogTrigger>
            <DialogContent className="w-sm border-none outline-none">
                <DialogHeader className="space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                        <MailCheck className="h-8 w-8 text-blue-600" />
                    </div>
                    <DialogTitle className="text-center text-xl font-semibold">
                        Verify this email address
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-600">
                        {email ? <span className="block font-medium text-gray-800">{email}</span> : null}
                        Use this when the verification code cannot reach the student. Only do it
                        once you are satisfied the address really is theirs — it is recorded in
                        the audit log against your account.
                        <span className="mt-2 block">
                            This does not approve the account; that is still a separate step.
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="w-full sm:justify-center">
                    <Button
                        variant="default"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isPending}
                        onClick={() => mutate()}
                    >
                        {isPending
                            ? <RefreshCcw className="h-4 w-4 animate-spin" style={{ animationDuration: '0.4s' }} />
                            : "Verify Email"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default memo(VerifyStudentEmail);
