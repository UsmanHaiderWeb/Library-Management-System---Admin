import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { extractCoverColor } from '@/lib/coverColor';

/**
 * Neutral slate used before a cover is chosen.
 *
 * Deliberately NOT black: pure black passes validation and looks like a
 * deliberate choice, so a failed extraction would silently ship a black book
 * that nobody notices until it is on the shelf in the student portal.
 */
export const DEFAULT_COVER_COLOR = '#3B4A6B';

/**
 * Picks the book's primary colour off its cover so the librarian doesn't have
 * to choose one by hand. The manual picker still wins if they change it —
 * this only ever fills the field, it never locks it.
 */
export const useCoverColor = (onColor: (hex: string) => void) => {
    const [isPickingColor, setIsPickingColor] = useState(false);
    const [colorWasAutoPicked, setColorWasAutoPicked] = useState(false);

    const pickColorFromCover = useCallback(async (source: File | string | null | undefined) => {
        if (!source) return;

        setIsPickingColor(true);
        try {
            const hex = await extractCoverColor(source);
            if (hex) {
                onColor(hex);
                setColorWasAutoPicked(true);
            } else {
                // Never fail silently — the admin must know to pick one.
                setColorWasAutoPicked(false);
                toast.warning("Couldn't read a colour from this cover", {
                    description: 'Please choose the book colour manually.',
                });
            }
        } finally {
            setIsPickingColor(false);
        }
    }, [onColor]);

    /** Call when the admin edits the colour by hand, to drop the "auto" badge. */
    const markManual = useCallback(() => setColorWasAutoPicked(false), []);

    return { isPickingColor, colorWasAutoPicked, pickColorFromCover, markManual };
};
