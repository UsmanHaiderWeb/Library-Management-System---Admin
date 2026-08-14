/**
 * Feature switches for parts of the product that are built but not currently
 * in use.
 *
 * The backend endpoints, database tables and page components all remain in
 * place — only the way in is hidden. Flipping a flag back to true restores the
 * feature with no other changes.
 */
export const FEATURES = {
    /**
     * Book purchase requests (students suggest titles for the library to buy).
     * Disabled 2026-08 pending a decision on how the workflow should run.
     * Also gated in the Student portal — see Student/src/lib/features.ts.
     */
    purchaseRequests: false,
} as const;
