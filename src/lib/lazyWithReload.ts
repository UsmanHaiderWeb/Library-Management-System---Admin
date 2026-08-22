import { lazy, type ComponentType } from 'react';

/**
 * Route-splitting that survives a deployment.
 *
 * A tab open across a deploy still holds the previous index.html, so it asks
 * for chunk filenames that the new build replaced — and navigating anywhere
 * lazy dies with "Failed to fetch dynamically imported module". The page is
 * not broken, it is simply out of date, and the only real fix is to fetch the
 * new index.html.
 *
 * So: reload once, automatically. The sessionStorage marker is what keeps that
 * from becoming a loop — if the import still fails after a fresh load the
 * problem is not staleness, and the error is allowed through to the boundary
 * where a person can see it.
 */

const RELOAD_MARKER = 'lms:chunk-reload';

/** Bundlers phrase this differently; match on what they have in common. */
const looksLikeStaleChunk = (error: unknown): boolean => {
    const message = error instanceof Error ? error.message : String(error);
    return /dynamically imported module|Importing a module script failed|ChunkLoadError|Loading chunk \d+ failed/i
        .test(message);
};

// Mirrors React.lazy's own signature: memo()-wrapped components are
// NamedExoticComponent and do not satisfy ComponentType<unknown>.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lazyWithReload = <T extends ComponentType<any>>(
    factory: () => Promise<{ default: T }>,
) =>
    lazy(async () => {
        try {
            const module = await factory();
            // Got there: clear the marker so a later deploy may reload again
            sessionStorage.removeItem(RELOAD_MARKER);
            return module;
        } catch (error) {
            const alreadyReloaded = sessionStorage.getItem(RELOAD_MARKER);

            if (looksLikeStaleChunk(error) && !alreadyReloaded) {
                sessionStorage.setItem(RELOAD_MARKER, String(Date.now()));
                // Replace, not assign: the broken URL should not become a
                // history entry the back button can return to
                window.location.reload();
                // Never settles; the reload takes over
                return new Promise<never>(() => {});
            }

            throw error;
        }
    });
