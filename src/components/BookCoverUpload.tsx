import { memo, useCallback, useRef, useState, type DragEvent } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
import { toast } from "sonner";
import ImageCropModal from "@/components/ImageCropModal";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { cn } from "@/lib/utils";
import { COVER_ASPECT, COVER_OUTPUT_SIZE } from "@/lib/bookCover";

/** Source images above this are refused before cropping. */
const MAX_SOURCE_MB = 10;

interface Props {
    /** The cropped cover chosen in this session, if any. */
    value?: File | null;
    /** Cover already stored for the book (edit form). */
    existingUrl?: string;
    onChange: (file: File) => void;
    disabled?: boolean;
}

/**
 * Click / drag-and-drop picker that opens the crop modal and hands back a
 * JPEG cropped to the book-cover slot at a fixed size. Ported from the
 * ticketly-shared-ui `FileUpload` (server-side optimisation removed: the
 * cropped file goes straight to ImageKit).
 */
function BookCoverUpload({ value, existingUrl, onChange, disabled }: Props) {
    const [isDragging, setIsDragging] = useState(false);

    // Crop modal state
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
    const [currentFileName, setCurrentFileName] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const previewUrl = useObjectUrl(value) || existingUrl;

    const resetInput = () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const releaseTempImage = () => {
        if (tempImageSrc) URL.revokeObjectURL(tempImageSrc);
        setTempImageSrc(null);
    };

    const handleFileSelect = (file: File | undefined) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please choose an image file (JPG, PNG or WebP)", { icon: <X stroke="red" /> });
            resetInput();
            return;
        }

        if (+(file.size / (1024 * 1024)).toFixed(2) > MAX_SOURCE_MB) {
            toast.error(`Image size cannot be greater than ${MAX_SOURCE_MB} MB`, { icon: <X stroke="red" /> });
            resetInput();
            return;
        }

        setTempImageSrc(URL.createObjectURL(file));
        setCurrentFileName(file.name);
        setCropModalOpen(true);
    };

    const handleDrop = useCallback((e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;
        handleFileSelect(e.dataTransfer.files[0]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disabled]);

    const handleCropConfirm = (blob: Blob) => {
        if (!tempImageSrc) return;

        // The modal already re-encodes to stay under this; a miss here means
        // something went badly wrong with the source image.
        const fileSizeMB = +(blob.size / (1024 * 1024)).toFixed(2);
        if (fileSizeMB > 4.5) {
            toast.error(`The cropped image is too large (${fileSizeMB} MB). Please try a smaller image.`, { icon: <X stroke="red" /> });
            setCropModalOpen(false);
            releaseTempImage();
            resetInput();
            return;
        }

        // Always a JPEG now, whatever was picked
        const baseName = currentFileName.replace(/\.[^.]+$/, "") || "cover";
        const file = new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
        onChange(file);

        setCropModalOpen(false);
        releaseTempImage();
        resetInput();
    };

    const handleCropCancel = () => {
        setCropModalOpen(false);
        releaseTempImage();
        resetInput();
    };

    return (
        <div className="w-full">
            {/* Hidden file input (always mounted) */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
                disabled={disabled}
                className="hidden"
            />

            <div
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-disabled={disabled}
                className={cn(
                    "relative flex w-full items-center gap-4 rounded-xl border-2 border-dashed bg-gray-50/60 p-4 transition-colors",
                    isDragging ? "border-[#283A8A] bg-[#283A8A]/5" : "border-gray-200 hover:border-[#283A8A]/50",
                    disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                )}
                onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
                onDragEnter={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={handleDrop}
                title={previewUrl ? "Click to replace the cover" : "Upload a cover image"}
                onClick={() => !disabled && fileInputRef.current?.click()}
                onKeyDown={(e) => {
                    if (disabled) return;
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        fileInputRef.current?.click();
                    }
                }}
            >
                {/* Portrait slot in the exact cover ratio */}
                <div
                    className="flex w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm"
                    style={{ aspectRatio: COVER_ASPECT }}
                >
                    {previewUrl ? (
                        <img src={previewUrl} alt="Book cover preview" className="h-full w-full object-cover" />
                    ) : (
                        <ImageIcon className="h-6 w-6 text-gray-300" />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#283A8A]/10">
                            <Upload className="h-4 w-4 text-[#283A8A]" />
                        </div>
                        {isDragging ? (
                            <p className="text-sm font-medium text-[#283A8A]">Drop it here</p>
                        ) : (
                            <p className="text-sm text-gray-600">
                                <span className="font-medium text-[#283A8A]">
                                    {previewUrl ? "Click to replace" : "Click to upload"}
                                </span>{" "}
                                or drag and drop
                            </p>
                        )}
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500">
                        JPG, PNG or WebP (Max {MAX_SOURCE_MB} MB). You will crop it to the book-cover shape,
                        saved at {COVER_OUTPUT_SIZE.width} &times; {COVER_OUTPUT_SIZE.height} px.
                    </p>
                    {value && (
                        <p className="mt-1 truncate text-xs text-gray-500" title={value.name}>
                            Selected: {value.name}
                        </p>
                    )}
                </div>
            </div>

            {/* Crop modal */}
            {tempImageSrc && (
                <ImageCropModal
                    open={cropModalOpen}
                    imageSrc={tempImageSrc}
                    onClose={handleCropCancel}
                    onConfirm={handleCropConfirm}
                    aspect={COVER_ASPECT}
                    cropShape="rect"
                    showRotationControl={false}
                    allowBothFitting
                    outputSize={COVER_OUTPUT_SIZE}
                    title="Crop book cover"
                />
            )}
        </div>
    );
}

export default memo(BookCoverUpload);
