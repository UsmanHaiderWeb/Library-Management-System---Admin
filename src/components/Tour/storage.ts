/**
 * Remembers which tour chapters an admin has already seen, per account, so a
 * shared desk machine doesn't show one librarian's progress to the next.
 */

const KEY_PREFIX = 'giccl_admin_tour_v1';

export type TourProgress = Record<string, boolean>;

const keyFor = (userId: string) => `${KEY_PREFIX}:${userId}`;

export const readTourProgress = (userId: string | null): TourProgress | null => {
    if (!userId) return null;
    try {
        const raw = localStorage.getItem(keyFor(userId));
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as TourProgress) : {};
    } catch {
        return null;
    }
};

export const markChapterSeen = (userId: string | null, chapterId: string) => {
    if (!userId) return;
    try {
        const current = readTourProgress(userId) || {};
        localStorage.setItem(keyFor(userId), JSON.stringify({ ...current, [chapterId]: true }));
    } catch {
        /* storage unavailable — the tour simply shows again next time */
    }
};

export const clearChapterSeen = (userId: string | null, chapterId: string) => {
    if (!userId) return;
    try {
        const current = readTourProgress(userId) || {};
        delete current[chapterId];
        localStorage.setItem(keyFor(userId), JSON.stringify(current));
    } catch {
        /* storage unavailable */
    }
};

export const clearTourProgress = (userId: string | null) => {
    if (!userId) return;
    try {
        localStorage.removeItem(keyFor(userId));
    } catch {
        /* storage unavailable */
    }
};
