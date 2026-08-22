/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import BookCover from '@/components/BookCover';
import { api } from '@/lib/AxiosCalls';
import { Checkbox } from '@/components/ui/checkbox';
import RichTextEditor from '@/components/RichTextEditor';
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/react";
import { toast } from 'sonner';
import { X, Wand2, Loader2 } from 'lucide-react';
import { useCoverColor, DEFAULT_COVER_COLOR } from '@/hooks/useCoverColor';
import { useObjectUrl } from '@/hooks/useObjectUrl';
import BookCoverUpload from '@/components/BookCoverUpload';

const bookSchema = z.object({
    bookNumber: z.string().min(1, 'Book number is required'),
    isbn: z.string().optional(),
    bookName: z.string().min(1, 'Book name is required'),
    summary: z.string().min(1, 'Summary is required'),
    author: z.string().min(1, 'Please provide author name'),
    genre: z.string().min(1, 'Please enter some genres for the book'),
    // `: boolean` stops TS inferring a type predicate, which would make the
    // resolver's output type differ from the form's input type.
    image: z.any().refine((f): boolean => f instanceof File, 'Book cover image is required'),
    bgColor: z.string().min(1, 'Please Choose or enter Primary color'),
    totalBooks: z.string().min(1, "Total number of books is required"),
    almirahNumber: z.string().min(1, "Almirah Number is required"),
    shelfNumber: z.string().min(1, "Shelf Number is required"),
    isOnline: z.boolean().optional(),
    onlineFile: z.any().optional()
}).superRefine((data, ctx) => {
    if (data.isOnline && !data.onlineFile) {
        ctx.addIssue({
            path: ['onlineFile'],
            code: z.ZodIssueCode.custom,
            message: "Online file is required",
        });
    }
});

type BookForm = z.infer<typeof bookSchema>;

const addNewBookApiCall = async (data: { formData: any, token: string }) => {
    const response = await api.post(
        `/api/books/create`,
        data.formData,
        {
            headers: {
                Authorization: `Bearer ${data.token}`,
            },
        }
    );
    return response.data;
};

const authenticator = async () => {
    try {
        const localToken = localStorage.getItem("adminToken") || "";
        // Perform the request to the upload authentication endpoint.
        const response = await api.get("/api/admin/imagekit-authentication-tokens", {
            headers: {
                Authorization: `Bearer ${localToken}`
            },
            withCredentials: true
        });

        // Parse and destructure the response JSON for upload credentials.
        const { signature, expire, token, publicKey } = response.data;
        return { signature, expire, token, publicKey };
    } catch (error) {
        // Log the original error for debugging before rethrowing a new error.
        console.error("Authentication error:", error);
        throw new Error("Authentication request failed");
    }
};


const AddNewBookForm = () => {
    const token = localStorage.getItem("adminToken") || "";
    const [isBookCreating, setIsBookCreating] = useState<boolean>(false);

    const abortController = new AbortController();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
        setValue,
    } = useForm<BookForm>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            bgColor: DEFAULT_COVER_COLOR,
            totalBooks: "",
            isOnline: false,
        },
    });

    const { isPickingColor, colorWasAutoPicked, pickColorFromCover } =
        useCoverColor((hex) => setValue('bgColor', hex, { shouldValidate: true }));

    const coverFile = watch('image') as File | undefined;
    const coverPreviewUrl = useObjectUrl(coverFile);

    const mutation = useMutation({
        mutationKey: ["add new book"],
        mutationFn: addNewBookApiCall,
        onError: () => {
            setIsBookCreating(false);
        },
        onSuccess: () => {
            reset();
            setIsBookCreating(false);
        },
    });

    const handleUpload = async (file: File, authParams: {
        signature: string;
        expire: number;
        token: string;
        publicKey: string;
    }) => {
        const { signature, expire, token, publicKey } = authParams;

        // Call the ImageKit SDK upload function with the required parameters and callbacks.
        try {
            const uploadResponse = await upload({
                // Authentication parameters
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name, // Optionally set a custom file name
                // onProgress: (event) => {
                //     setProgress((event.loaded / event.total) * 100);
                // },
                abortSignal: abortController.signal,
            });
            return uploadResponse;
        } catch (error) {
            // Handle specific error types provided by the ImageKit SDK.
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
            } else {
                // Handle any other errors that may occur.
                console.error("Upload error:", error);
            }
            toast.error("Error occured while uploading the files.", {
                icon: <X stroke='red' />
            });
        }
        return null;
    };

    const onSubmit = async (data: BookForm) => {
        setIsBookCreating(true);

        // Retrieve authentication parameters for the upload.
        let authParams;
        try {
            authParams = await authenticator();
        } catch (authError) {
            console.error("Failed to authenticate for upload:", authError);
            setIsBookCreating(false);
            return;
        }

        const imageUploadResponse = await handleUpload(data?.image, authParams);
        if (!imageUploadResponse) {
            setIsBookCreating(false);
            return toast.error("Something went wrong while uploading the file(s).", {
                icon: <X stroke='red' />
            })
        }

        let PDF_UploadResponse;
        if (data.isOnline) {
            PDF_UploadResponse = await handleUpload(data?.onlineFile, authParams);
            if (!PDF_UploadResponse) {
                setIsBookCreating(false);
                return toast.error("Something went wrong while uploading the file(s).", {
                    icon: <X stroke='red' />
                })
            }
        }

        mutation.mutate({
            formData: {
                ...data,
                image: imageUploadResponse?.url,
                onlineFileUrl: PDF_UploadResponse?.url,
            },
            token
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl px-8 py-8 min-h-screen">
            <title>Add New Book - GICCL | Library</title>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Book Number</label>
                <Input placeholder="Enter the book number" {...register('bookNumber')} disabled={mutation.isPending || isBookCreating} />
                {errors.bookNumber && (
                    <p className='text-sm text-red-500'>{errors.bookNumber.message}</p>
                )}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">ISBN <span className="text-gray-400 text-sm font-normal">(optional)</span></label>
                <Input placeholder="e.g. 978-3-16-148410-0" {...register('isbn')} disabled={mutation.isPending || isBookCreating} />
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Book Name</label>
                <Input placeholder="Enter the book name" {...register('bookName')} disabled={mutation.isPending || isBookCreating} />
                {errors.bookName && (
                    <p className='text-sm text-red-500'>{errors.bookName.message}</p>
                )}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Author</label>
                <Input placeholder="Enter the author name" {...register('author')} disabled={mutation.isPending || isBookCreating} />
                {errors.author && (
                    <p className='text-sm text-red-500'>{errors.author.message}</p>
                )}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Genre</label>
                <Input placeholder="Enter the genre of the book" {...register('genre')} disabled={mutation.isPending || isBookCreating} />
                {errors.genre && (
                    <p className='text-sm text-red-500'>{errors.genre.message}</p>
                )}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Total number of books</label>
                <Input type="number" placeholder="Enter the total number of books" {...register('totalBooks', { required: "Enter total number of books available." })} disabled={mutation.isPending || isBookCreating} />
                {errors.totalBooks && (
                    <p className='text-sm text-red-500'>{errors.totalBooks.message}</p>
                )}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Almirah number</label>
                <Input type="number" placeholder="Enter the almirah number" {...register('almirahNumber', { required: "Enter almirah number." })} disabled={mutation.isPending || isBookCreating} />
                {errors.almirahNumber && (
                    <p className='text-sm text-red-500'>{errors.almirahNumber.message}</p>
                )}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Shelf number</label>
                <Input type="number" placeholder="Enter the shelf number" {...register('shelfNumber', { required: "Enter shelf number." })} disabled={mutation.isPending || isBookCreating} />
                {errors.shelfNumber && (
                    <p className='text-sm text-red-500'>{errors.shelfNumber.message}</p>
                )}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Book Cover Image</label>
                <Controller
                    name='image'
                    control={control}
                    render={({ field }) => (
                        <BookCoverUpload
                            value={field.value}
                            disabled={mutation.isPending || isBookCreating}
                            onChange={(file) => {
                                field.onChange(file);
                                // Derive the spine colour from the cropped cover the moment it is chosen
                                pickColorFromCover(file);
                            }}
                        />
                    )}
                />
                {errors.image && (
                    <p className='text-sm text-red-500'>{errors.image.message?.toString()}</p>
                )}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Book Primary Color</label>
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50/60 px-3 py-2.5">
                    <label htmlFor="color" className="relative shrink-0 cursor-pointer" title="Click to change">
                        <Input
                            type="color"
                            id="color"
                            className="h-9 w-9 cursor-pointer p-0 border-none bg-transparent"
                            {...register('bgColor')}
                            disabled={mutation.isPending || isBookCreating}
                        />
                    </label>

                    <div className="min-w-0 flex-1">
                        {isPickingColor ? (
                            <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Reading colour from cover…
                            </span>
                        ) : (
                            <>
                                <span className="font-mono text-sm uppercase text-gray-700">{watch('bgColor')}</span>
                                <span className="ml-2 text-xs text-gray-500">
                                    {colorWasAutoPicked ? 'from cover' : 'click the swatch to change'}
                                </span>
                            </>
                        )}
                    </div>

                    {watch('image') && !isPickingColor && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="shrink-0 gap-1.5 text-gray-600"
                            onClick={() => pickColorFromCover(watch('image'))}
                            disabled={mutation.isPending || isBookCreating}
                        >
                            <Wand2 className="h-3.5 w-3.5" />
                            Re-pick
                        </Button>
                    )}
                </div>
                {errors.bgColor && (
                    <p className='text-sm text-red-500'>{errors.bgColor.message}</p>
                )}
            </div>

            {coverPreviewUrl && (<>
                <div className="mb-2">
                    <label className="block mb-1 font-medium">Book Preview</label>
                </div>
                <div className='mb-5'>
                    <BookPreview
                        coverColor={watch('bgColor')}
                        coverImage={coverPreviewUrl}
                    />
                </div>
            </>)}

            {/* <div className="mb-5">
                    <label className="block mb-1 font-medium">Book Video</label>
                    <Input type="file" accept="video/*" {...register('video')} disabled={mutation.isPending || isBookCreating} />
                    {errors.video && (
                        <p className='text-sm text-red-500'>{errors.video.message?.toString()}</p>
                    )}
                </div> */}

            <div className="mb-5">
                <label className="block mb-1 font-medium">Book Summary</label>
                <Controller
                    name='summary'
                    control={control}
                    render={({ field }) => (
                        <RichTextEditor
                            value={field.value || ''}
                            onChange={field.onChange}
                            placeholder="Write a brief summary of the book"
                            disabled={mutation.isPending || isBookCreating}
                        />
                    )}
                />
                {errors.summary && (
                    <p className='text-sm text-red-500'>{errors.summary.message}</p>
                )}
            </div>

            <Controller
                name='isOnline'
                control={control}
                render={({ field }) => (<>
                    <div className="mb-5">
                        <label className="block mb-1 font-medium">PDF Book Available?</label>
                        <div className='flex items-center space-x-3'>
                            <Checkbox
                                className='border-black/40'
                                checked={field?.value}
                                onCheckedChange={field.onChange}
                                disabled={mutation.isPending || isBookCreating}
                            />
                            <span className="text-sm">This book also has a digital (PDF) copy students can read online</span>
                        </div>
                    </div>

                    {field.value &&
                        <div className="mb-5">
                            <label className="block mb-1 font-medium">Upload PDF</label>
                            <Input type="file" accept="pdf/*" {...register('onlineFile')} disabled={mutation.isPending || isBookCreating} />
                            {errors.onlineFile && (
                                <p className='text-sm text-red-500'>{errors.onlineFile.message?.toString()}</p>
                            )}
                        </div>
                    }
                </>)}
            />

            <Button type="submit" className="w-full bg-[#283A8A] text-white mt-4" disabled={mutation.isPending || isBookCreating}>
                {mutation.isPending || isBookCreating ? 'Creating...' : 'Create Book'}
            </Button>
        </form>
    );
};

export default memo(AddNewBookForm);



const BookPreview = ({ coverColor, coverImage }: { coverColor: string, coverImage: string }) => {
    return (
        <div>
            <BookCover coverColor={coverColor} coverImage={coverImage} variant='medium' />
        </div>
    )
}