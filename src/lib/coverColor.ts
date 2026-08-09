/**
 * Derives a book's primary colour from its cover image.
 *
 * The colour is used for the 3D spine behind the cover, which carries white
 * detailing — so the result is nudged into a mid-dark, reasonably saturated
 * range rather than returned raw. A cover that is mostly white paper would
 * otherwise produce an unusable near-white spine.
 *
 * Runs entirely in the browser on the file the librarian just picked (a
 * same-origin blob: URL), so there is no CORS/tainted-canvas problem and no
 * round trip before the upload.
 */

const SAMPLE_SIZE = 64;      // downscale before sampling — plenty for an average
const QUANT_STEP = 24;       // bucket width per channel when grouping colours

type Rgb = { r: number; g: number; b: number };

const toHex = ({ r, g, b }: Rgb): string =>
    '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

function rgbToHsl({ r, g, b }: Rgb) {
    const rn = r / 255, gn = g / 255, bn = b / 255;
    const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;
    let h = 0, s = 0;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        else if (max === gn) h = ((bn - rn) / d + 2) / 6;
        else h = ((rn - gn) / d + 4) / 6;
    }
    return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number): Rgb {
    if (s === 0) { const v = l * 255; return { r: v, g: v, b: v }; }
    const hue = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return { r: hue(p, q, h + 1 / 3) * 255, g: hue(p, q, h) * 255, b: hue(p, q, h - 1 / 3) * 255 };
}

/** Keeps the spine dark enough for its white detailing to read. */
function toSpineTone(rgb: Rgb): Rgb {
    const { h, s, l } = rgbToHsl(rgb);
    const clampedL = Math.min(Math.max(l, 0.22), 0.45);

    // Greyscale has no meaningful hue — hue is 0, i.e. red — so boosting
    // saturation here would turn a black-and-white cover into a red or purple
    // spine. Keep neutral covers neutral.
    if (s < 0.12) {
        return hslToRgb(h, 0.04, clampedL);
    }

    // Give washed-out covers a little life, but never neon
    const clampedS = Math.min(Math.max(s, 0.25), 0.85);
    return hslToRgb(h, clampedS, clampedL);
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        // Harmless for blob: URLs, and lets remote covers work when the host
        // sends permissive CORS headers (ImageKit does).
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Could not load image'));
        img.src = src;
    });
}

/**
 * Returns a hex colour for the given cover, or null if it could not be read
 * (unsupported file, blocked by CORS, etc.) so callers can leave the existing
 * value alone.
 */
export async function extractCoverColor(source: File | string): Promise<string | null> {
    const objectUrl = typeof source === 'string' ? null : URL.createObjectURL(source);
    const src = objectUrl ?? (source as string);

    try {
        const img = await loadImage(src);

        const canvas = document.createElement('canvas');
        canvas.width = SAMPLE_SIZE;
        canvas.height = SAMPLE_SIZE;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return null;

        ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        const { data } = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

        const buckets = new Map<string, { sum: Rgb; count: number; score: number }>();
        let usable = 0;
        const totalPixels = SAMPLE_SIZE * SAMPLE_SIZE;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
            if (a < 125) continue;

            const { s, l } = rgbToHsl({ r, g, b });
            // Covers are mostly paper and print. Cream sits around 0.88
            // lightness and would otherwise win on sheer area alone.
            if (l > 0.88 || l < 0.10) continue;
            if (s < 0.10 && l > 0.65) continue;

            usable++;
            const key = `${Math.round(r / QUANT_STEP)}-${Math.round(g / QUANT_STEP)}-${Math.round(b / QUANT_STEP)}`;
            const bucket = buckets.get(key) ?? { sum: { r: 0, g: 0, b: 0 }, count: 0, score: 0 };
            bucket.sum.r += r; bucket.sum.g += g; bucket.sum.b += b;
            bucket.count += 1;
            // Squaring saturation lets a small vivid area beat a large pale one
            bucket.score += 0.25 + s * s * 3;
            buckets.set(key, bucket);
        }

        if (buckets.size === 0) return null;

        const winner = [...buckets.values()].sort((a, b) => b.score - a.score)[0];
        const average: Rgb = {
            r: winner.sum.r / winner.count,
            g: winner.sum.g / winner.count,
            b: winner.sum.b / winner.count,
        };

        // If barely any of the cover was usable, or the winning tone is nearly
        // grey, we don't really know the colour — return a neutral spine rather
        // than inventing a confident-looking one.
        const { s: winnerSaturation } = rgbToHsl(average);
        const confident = winnerSaturation >= 0.15 && usable >= totalPixels * 0.05;
        if (!confident) {
            const { h, l } = rgbToHsl(average);
            return toHex(hslToRgb(h, 0.05, Math.min(Math.max(l, 0.22), 0.42)));
        }

        return toHex(toSpineTone(average));
    } catch {
        return null;
    } finally {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
}
