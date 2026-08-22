/**
 * Zoom that makes the image fill the crop box with no gaps on first render.
 * react-easy-crop shows the media with 'contain' logic at zoom = 1, so the
 * required zoom is the ratio between the crop box and that displayed size.
 */
export const calculateInitialZoom = ({
    containerSize,
    mediaSize,
    cropSize,
    allowBothFitting,
}: {
    containerSize: { width: number; height: number };
    mediaSize: { naturalWidth: number; naturalHeight: number };
    cropSize: { width: number; height: number };
    allowBothFitting: boolean;
}): number => {
    // 1. Displayed dimensions at zoom = 1 (fit to container)
    const scaleX = containerSize.width / mediaSize.naturalWidth;
    const scaleY = containerSize.height / mediaSize.naturalHeight;
    const fitScale = Math.min(scaleX, scaleY);

    const displayW = mediaSize.naturalWidth * fitScale;
    const displayH = mediaSize.naturalHeight * fitScale;

    if (allowBothFitting) {
        // Cover mode: satisfy the larger requirement so there are no gaps
        const zoomToFillWidth = cropSize.width / displayW;
        const zoomToFillHeight = cropSize.height / displayH;
        return Math.max(zoomToFillWidth, zoomToFillHeight);
    }

    return cropSize.width / displayW;
};
