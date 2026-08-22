/**
 * Book cover geometry, derived from the spine artwork in `BookCover.tsx`.
 *
 * The SVG has a 143 x 199 viewBox and the cover image is laid over it at
 * `left: 12%; width: 87.5%; height: 88%`, so the image slot itself is
 * 125.125 x 175.12 units. Every uploaded cover is cropped to exactly that
 * ratio and exported at a fixed pixel size, so nothing is ever stretched by
 * the `object-fill` used to paint it into the slot.
 */
const SVG_VIEWBOX = { width: 143, height: 199 } as const;
const SLOT_FRACTION = { width: 0.875, height: 0.88 } as const;

export const COVER_SLOT = {
    width: SVG_VIEWBOX.width * SLOT_FRACTION.width,   // 125.125
    height: SVG_VIEWBOX.height * SLOT_FRACTION.height, // 175.12
} as const;

/** width / height, about 0.7145 */
export const COVER_ASPECT = COVER_SLOT.width / COVER_SLOT.height;

/**
 * Pixel size every cover is exported at (8x the slot, rounded). Comfortably
 * above the largest place a cover is drawn (296 x 404 CSS px, i.e. 592 x 808
 * on a 2x display) while keeping the JPEG small.
 */
export const COVER_OUTPUT_SIZE = {
    width: 1000,
    height: Math.round(1000 / COVER_ASPECT), // 1400
} as const;
