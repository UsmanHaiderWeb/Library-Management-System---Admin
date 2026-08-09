import { useCallback, useState } from 'react';
import { extractCoverColor } from '@/lib/coverColor';

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
            }
        } finally {
            setIsPickingColor(false);
        }
    }, [onColor]);

    /** Call when the admin edits the colour by hand, to drop the "auto" badge. */
    const markManual = useCallback(() => setColorWasAutoPicked(false), []);

    return { isPickingColor, colorWasAutoPicked, pickColorFromCover, markManual };
};
