export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

export function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = getRadianAngle(rotation);

    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
}

export interface PixelCrop {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface CropOptions {
    rotation?: number;
    flip?: { horizontal: boolean; vertical: boolean };
    /** Solid fill behind the crop when `enableBlurredBackground` is off. */
    backgroundColor?: string;
    /** Paint a blurred, zoomed copy of the image behind the crop. */
    enableBlurredBackground?: boolean;
    /** Cap on the longer side when no `outputSize` is given. */
    maxDimension?: number;
    /** JPEG quality 0-1. */
    quality?: number;
    /**
     * Exact pixel size of the result. The crop region is scaled onto it, so
     * the crop aspect must already match or the image will be distorted.
     */
    outputSize?: { width: number; height: number };
}

/**
 * Adapted from the react-image-crop README; ported from ticketly-shared-ui
 * (watermark support removed).
 */
export default async function getCroppedImage(
    imageSrc: string,
    pixelCrop: PixelCrop,
    {
        rotation = 0,
        flip = { horizontal: false, vertical: false },
        backgroundColor = 'transparent',
        enableBlurredBackground = false,
        maxDimension = 2500,
        quality = 0.85,
        outputSize,
    }: CropOptions = {},
): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('No 2d context');
    }

    const rotRad = getRadianAngle(rotation);

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation,
    );

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    // draw rotated image
    ctx.drawImage(image, 0, 0);

    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');

    if (!croppedCtx) {
        throw new Error('No 2d context');
    }

    // Determine target size: fixed output, otherwise the crop capped at maxDimension
    let targetWidth = pixelCrop.width;
    let targetHeight = pixelCrop.height;

    if (outputSize) {
        targetWidth = outputSize.width;
        targetHeight = outputSize.height;
    } else if (maxDimension && (targetWidth > maxDimension || targetHeight > maxDimension)) {
        const scale = Math.min(maxDimension / targetWidth, maxDimension / targetHeight);
        targetWidth = targetWidth * scale;
        targetHeight = targetHeight * scale;
    }

    croppedCanvas.width = targetWidth;
    croppedCanvas.height = targetHeight;

    // Draw background
    if (enableBlurredBackground) {
        // The same image, zoomed to cover, and blurred
        const scale = Math.max(croppedCanvas.width / image.width, croppedCanvas.height / image.height);
        const x = (croppedCanvas.width / 2) - (image.width / 2) * scale;
        const y = (croppedCanvas.height / 2) - (image.height / 2) * scale;

        croppedCtx.save();
        croppedCtx.filter = 'blur(20px) brightness(0.9)';
        croppedCtx.drawImage(
            image,
            x,
            y,
            image.width * scale,
            image.height * scale,
        );
        croppedCtx.restore();
    } else {
        croppedCtx.fillStyle = backgroundColor;
        croppedCtx.fillRect(0, 0, croppedCanvas.width, croppedCanvas.height);
    }

    // Draw the cropped region onto the new canvas, scaling to the target size
    croppedCtx.drawImage(
        canvas,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        targetWidth,
        targetHeight,
    );

    return new Promise((resolve, reject) => {
        croppedCanvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('Canvas is empty'));
            }
        }, 'image/jpeg', quality);
    });
}
