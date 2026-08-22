import { useEffect, useRef, useState } from "react";
import Cropper, { type Area, type MediaSize } from "react-easy-crop";
import { Image as ImageIcon, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import getCroppedImage from "@/lib/cropImage";
import { calculateInitialZoom } from "@/lib/imageAnalysis";

interface Props {
    open: boolean;
    imageSrc: string;
    onClose: () => void;
    onConfirm: (blob: Blob) => void;
    /** width / height of the crop box. */
    aspect?: number;
    cropShape?: "rect" | "round";
    showRotationControl?: boolean;
    /**
     * Start zoomed so the image covers the whole crop box (no gaps). When off
     * the image is only zoomed to fill the crop width.
     */
    allowBothFitting?: boolean;
    /** Exact pixel size of the exported image. Must match `aspect`. */
    outputSize?: { width: number; height: number };
    title?: string;
}

/** Ported from ticketly-shared-ui `ImageCropModal` (watermark and
 *  background-colour controls removed). */
export default function ImageCropModal({
    open,
    imageSrc,
    onClose,
    onConfirm,
    aspect = 16 / 9,
    cropShape = "rect",
    showRotationControl = false,
    allowBothFitting = true,
    outputSize,
    title = "Crop image",
}: Props) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [loading, setLoading] = useState(false);

    // Crop box forced to fill the container; media geometry once loaded
    const [cropSize, setCropSize] = useState<{ width: number; height: number } | undefined>(undefined);
    const [mediaSize, setMediaSize] = useState<MediaSize | undefined>(undefined);
    const containerRef = useRef<HTMLDivElement>(null);
    const initializedRef = useRef(false);

    // Size the crop box to the container and auto-zoom to cover on first load
    useEffect(() => {
        const calculateCropSize = () => {
            if (!containerRef.current) return;
            const { clientWidth, clientHeight } = containerRef.current;
            if (!clientWidth || !clientHeight) return;

            // Largest box of the wanted aspect that fits inside the container
            const containerRatio = clientWidth / clientHeight;
            let width: number;
            let height: number;

            if (containerRatio > aspect) {
                // Container is wider than the aspect ratio -> constrain by height
                height = clientHeight;
                width = height * aspect;
            } else {
                // Container is taller than the aspect ratio -> constrain by width
                width = clientWidth;
                height = width / aspect;
            }

            const newCropSize = { width: width * 0.9, height: height * 0.9 };
            setCropSize(newCropSize);

            if (mediaSize && !initializedRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const targetZoom = calculateInitialZoom({
                    containerSize: { width: containerRect.width, height: containerRect.height },
                    mediaSize: { naturalWidth: mediaSize.naturalWidth, naturalHeight: mediaSize.naturalHeight },
                    cropSize: newCropSize,
                    allowBothFitting,
                });
                setZoom(targetZoom);
                initializedRef.current = true;
            }
        };

        // ResizeObserver covers window resizes and the dialog's open transition
        const observer = new ResizeObserver(() => calculateCropSize());
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        calculateCropSize();

        return () => observer.disconnect();
    }, [aspect, open, mediaSize, allowBothFitting]);

    // Fresh state for every image
    useEffect(() => {
        setCrop({ x: 0, y: 0 });
        setRotation(0);
        setZoom(1);
        setCroppedAreaPixels(null);
        setMediaSize(undefined);
        initializedRef.current = false;
    }, [imageSrc]);

    /**
     * Read the crop rectangle straight from the DOM. react-easy-crop's own
     * `croppedAreaPixels` drifts by a pixel or two when the crop box is
     * larger than the media at low zoom; the DOM positions are exact.
     */
    const computeCropRect = (): Area | null => {
        const container = containerRef.current;
        const naturalW = mediaSize?.naturalWidth;
        const naturalH = mediaSize?.naturalHeight;
        if (!container || !naturalW || !naturalH) return null;
        const imgEl = container.querySelector(".reactEasyCrop_Image") as HTMLElement | null;
        const areaEl = container.querySelector(".reactEasyCrop_CropArea") as HTMLElement | null;
        if (!imgEl || !areaEl) return null;
        const imgRect = imgEl.getBoundingClientRect();
        const areaRect = areaEl.getBoundingClientRect();
        if (!imgRect.width || !imgRect.height) return null;
        const scaleX = naturalW / imgRect.width;
        const scaleY = naturalH / imgRect.height;
        return {
            x: (areaRect.left - imgRect.left) * scaleX,
            y: (areaRect.top - imgRect.top) * scaleY,
            width: areaRect.width * scaleX,
            height: areaRect.height * scaleY,
        };
    };

    const handleSave = async () => {
        if (!croppedAreaPixels) return;
        try {
            setLoading(true);

            const domCrop = rotation === 0 ? computeCropRect() : null;
            const effectiveCrop = domCrop || croppedAreaPixels;

            // Re-encode at lower settings until the result is under 4.5 MB
            let currentBlob: Blob | null = null;
            let currentMaxDim = 2500;
            let currentQuality = 0.85;
            let attempt = 0;
            const maxAttempts = 3;

            while (attempt < maxAttempts) {
                currentBlob = await getCroppedImage(imageSrc, effectiveCrop, {
                    rotation,
                    enableBlurredBackground: true,
                    maxDimension: currentMaxDim,
                    quality: currentQuality,
                    outputSize,
                });

                if (currentBlob.size <= 4.5 * 1024 * 1024) {
                    break;
                }

                attempt++;
                if (attempt === 1) {
                    currentMaxDim = 2000;
                    currentQuality = 0.75;
                } else if (attempt === 2) {
                    currentMaxDim = 1600;
                    currentQuality = 0.65;
                }
            }

            if (currentBlob) {
                onConfirm(currentBlob);
                onClose();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen && !loading) onClose(); }}>
            <DialogContent className="max-w-5xl sm:max-w-5xl gap-0 overflow-hidden p-0">
                {/* Header */}
                <div className="flex items-center gap-2 border-b border-border px-6 py-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <ImageIcon className="h-5 w-5 text-primary" />
                    </div>
                    <DialogTitle className="text-lg font-semibold">
                        {cropShape === "round" ? "Crop profile picture" : title}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Drag the image to position it and use the slider to zoom, then apply the crop.
                    </DialogDescription>
                </div>

                {/* Cropper container */}
                <div ref={containerRef} className="relative h-[70vh] w-full bg-neutral-900">
                    {/* Blurred background layer, rendered before the cropper so it sits behind it */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <img
                            src={imageSrc}
                            alt=""
                            aria-hidden
                            className="h-full w-full scale-110 object-cover opacity-70 blur-[20px]"
                        />
                        <div className="absolute inset-0 bg-black/30" />
                    </div>

                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        rotation={rotation}
                        zoom={zoom}
                        aspect={aspect}
                        cropShape={cropShape}
                        onCropChange={setCrop}
                        onRotationChange={setRotation}
                        onZoomChange={setZoom}
                        onMediaLoaded={(media) => {
                            setMediaSize(media);
                            initializedRef.current = false;
                        }}
                        maxZoom={3}
                        minZoom={0.1}
                        zoomSpeed={0.01}
                        onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
                        cropSize={cropSize}
                        restrictPosition={false}
                        objectFit="contain"
                        style={{
                            containerStyle: { background: "transparent", width: "100%" },
                            cropAreaStyle: {
                                border: "2px solid white",
                                boxShadow: "0 0 0 9999em rgba(0, 0, 0, 0.5)",
                            },
                        }}
                    />
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-6 border-t border-border bg-background px-6 py-5 md:flex-row md:items-center">
                    {/* Zoom */}
                    <div className="w-full flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                            <ZoomOut className="h-4 w-4 text-muted-foreground" />
                            <input
                                type="range"
                                min={0.7}
                                max={3}
                                step={0.01}
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-muted accent-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <ZoomIn className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Zoom
                            </label>
                            <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                                {Math.round(zoom * 100)}%
                            </span>
                        </div>
                    </div>

                    {/* Rotation */}
                    {showRotationControl && (
                        <div className="w-full flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    <RotateCw className="h-3.5 w-3.5" />
                                    Rotate
                                </label>
                                <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                                    {rotation}&deg;
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-medium text-muted-foreground">0&deg;</span>
                                <input
                                    type="range"
                                    min={0}
                                    max={360}
                                    step={1}
                                    value={rotation}
                                    onChange={(e) => setRotation(Number(e.target.value))}
                                    className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-muted accent-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <span className="text-[10px] font-medium text-muted-foreground">360&deg;</span>
                            </div>
                        </div>
                    )}

                    <div className="hidden h-10 w-px bg-border md:block" />

                    <div className="flex items-center justify-end gap-3">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSave}
                            disabled={loading || !croppedAreaPixels}
                            className="gap-2 bg-[#283A8A] text-white hover:bg-[#283A8A]/90"
                        >
                            {loading ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Processing...
                                </>
                            ) : (
                                "Apply Crop"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
