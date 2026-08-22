import {
    useMutation,
    useQueryClient,
    type QueryKey,
    type UseMutationOptions,
} from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * Row actions that update the table before the server answers, and put it back
 * if the server refuses.
 *
 * Invalidating on success means the row keeps showing its old status until a
 * refetch completes — a visible lag on every approve, reject and status
 * change, and worse the slower the connection. Writing to the cache first
 * makes the table respond immediately; the refetch afterwards is what settles
 * any difference of opinion.
 */

type RowUpdate<TRow, TVars> =
    /** Replace the row with a patched copy. */
    | { patch: (row: TRow, variables: TVars) => TRow }
    /** Drop the row from the list — approvals that empty a queue, deletions. */
    | { remove: true };

interface Options<TData, TVars, TRow> {
    mutationFn: (variables: TVars) => Promise<TData>;
    /** Key prefix of every table this action affects, e.g. ['borrow-requests']. */
    queryKey: QueryKey;
    /** Identifies the row being acted on inside whatever list holds it. */
    matches: (row: TRow, variables: TVars) => boolean;
    update: RowUpdate<TRow, TVars>;
    successMessage?: string | ((data: TData, variables: TVars) => string);
    errorMessage?: string;
    /** Other caches to refresh once settled — dashboard counters and the like. */
    alsoInvalidate?: QueryKey[];
    /**
     * Runs the moment the action starts, before the request is answered.
     *
     * Closing a confirmation dialog belongs here rather than in onSuccess: the
     * optimistic update removes or rewrites the row immediately, and for a
     * dialog rendered inside that row, waiting for the response means it is
     * unmounted mid-animation instead of closing.
     */
    onStart?: (variables: TVars) => void;
    onSuccess?: UseMutationOptions<TData, unknown, TVars>['onSuccess'];
}

/**
 * Applies the change to every array in a cached response.
 *
 * These endpoints do not agree on a name for the list — `users`, `items`,
 * `books`, `requests` — so rather than teach this helper each one, it walks
 * whatever arrays the payload has. A row is only touched when `matches` says
 * so, which makes visiting the wrong array harmless.
 */
const applyToCachedLists = <TRow, TVars>(
    data: unknown,
    variables: TVars,
    matches: (row: TRow, variables: TVars) => boolean,
    update: RowUpdate<TRow, TVars>,
): unknown => {
    if (!data || typeof data !== 'object') return data;

    const source = data as Record<string, unknown>;
    let changed = false;
    const next: Record<string, unknown> = { ...source };

    for (const [key, value] of Object.entries(source)) {
        if (!Array.isArray(value)) continue;

        const rows = value as TRow[];
        if (!rows.some((row) => row && typeof row === 'object' && matches(row, variables))) continue;

        next[key] = 'remove' in update
            ? rows.filter((row) => !matches(row, variables))
            : rows.map((row) => (matches(row, variables) ? update.patch(row, variables) : row));
        changed = true;
    }

    return changed ? next : data;
};

export function useOptimisticRowMutation<TData, TVars, TRow>({
    mutationFn,
    queryKey,
    matches,
    update,
    successMessage,
    errorMessage = 'Something went wrong. Please try again.',
    alsoInvalidate = [],
    onStart,
    onSuccess,
}: Options<TData, TVars, TRow>) {
    const queryClient = useQueryClient();

    return useMutation<TData, unknown, TVars, { snapshot: Array<[QueryKey, unknown]> }>({
        mutationFn,

        onMutate: async (variables) => {
            onStart?.(variables);

            // Without this an in-flight refetch can land after the optimistic
            // write and quietly restore the stale row
            await queryClient.cancelQueries({ queryKey });

            const snapshot = queryClient.getQueriesData({ queryKey });
            queryClient.setQueriesData({ queryKey }, (old: unknown) =>
                applyToCachedLists<TRow, TVars>(old, variables, matches, update));

            return { snapshot };
        },

        onError: (error, _variables, context) => {
            // Put every affected cache back exactly as it was
            context?.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data));

            const message =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message
                || errorMessage;
            toast.error(message);
        },

        onSuccess: (data, variables, context) => {
            if (successMessage) {
                toast.success(typeof successMessage === 'function'
                    ? successMessage(data, variables)
                    : successMessage);
            }
            onSuccess?.(data, variables, context);
        },

        // Settled, not success: after a failure the rolled-back cache is also
        // worth re-checking against the server.
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
            alsoInvalidate.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
        },
    });
}
