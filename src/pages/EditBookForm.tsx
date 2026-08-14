/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, memo, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import BookCover from '@/components/BookCover';
import { api } from '@/lib/AxiosCalls';
import { Checkbox } from '@/components/ui/checkbox';
import RichTextEditor from '@/components/RichTextEditor';
import {
    upload,
} from "@imagekit/react";
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { Wand2, Loader2 } from 'lucide-react';
import { useCoverColor, DEFAULT_COVER_COLOR } from '@/hooks/useCoverColor';

const bookSchema = z.object({
    bookNumber: z.string().min(1, 'Book number is required'),
    isbn: z.string().optional(),
    bookName: z.string().min(1, 'Book name is required'),
    summary: z.string().min(1, 'Summary is required'),
    author: z.string().min(1, 'Please provide author name'),
    genre: z.string().min(1, 'Please enter some genres for the book'),
    image: z.any().optional(), // Optional for edit
    bgColor: z.string().min(1, 'Please Choose or enter Primary color'),
    totalBooks: z.string().min(1, "Total number of books is required"),
    almirahNumber: z.string().min(1, "Almirah Number is required"),
    shelfNumber: z.string().min(1, "Shelf Number is required"),
    isOnline: z.boolean().optional(),
    onlineFile: z.any().optional()
}).superRefine((data) => {
    if (data.isOnline && !data.onlineFile) {
        // If editing, we might already have a file, so this validation might need adjustment if we don't require re-upload.
        // For now, let's assume if they check isOnline, they might want to provide a file or keep existing.
        // If we want to keep existing, we need to handle that in the form logic (e.g. check if url exists).
        // But for simplicity, let's relax this check or handle it in submit.
    }
});

type BookForm = z.infer<typeof bookSchema>;

const updateBookApiCall = async (data: { formData: any, token: string, bookId: string }) => {
    const response = await api.post(
        `/api/books/update/${data.bookId}`,
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
        const response = await api.get("/api/admin/imagekit-authentication-tokens", {
            headers: {
                Authorization: `Bearer ${localToken}`
            },
            withCredentials: true
        });
        const { signature, expire, token, publicKey } = response.data;
        return { signature, expire, token, publicKey };
    } catch (error) {
        console.error("Authentication error:", error);
        throw new Error("Authentication request failed");
    }
};


const EditBookForm = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("adminToken") || "";
    const [isBookUpdating, setIsBookUpdating] = useState<boolean>(false);
    const [existingImage, setExistingImage] = useState<string>("");

    const abortController = new AbortController();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
        setValue
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

    // Fetch book details
    const { data: bookData } = useQuery({
        queryKey: ['book-details', bookId],
        queryFn: async () => {
            const response = await api.get(`/api/books/getBookDetails/${bookId}`);
            return response.data.book;
        },
        enabled: !!bookId
    });

    useEffect(() => {
        if (bookData) {
            reset({
                bookNumber: bookData.bookNumber,
                bookName: bookData.bookName,
                summary: bookData.summary,
                author: bookData.author,
                genre: bookData.genre,
                bgColor: bookData.bgColor,
                totalBooks: String(bookData.totalBooks),
                almirahNumber: String(bookData.almirahNumber),
                shelfNumber: String(bookData.shelfNumber),
                isOnline: bookData.isOnline,
            });
            setExistingImage(bookData.image);
        }
    }, [bookData, reset]);

    const mutation = useMutation({
        mutationKey: ["update book"],
        mutationFn: updateBookApiCall,
        onError: () => {
            setIsBookUpdating(false);
            toast.error("Failed to update book");
        },
        onSuccess: () => {
            setIsBookUpdating(false);
            toast.success("Book updated successfully");
            navigate('/all-books');
        },
    });

    const handleUpload = async (file: File, authParams: any) => {
        const { signature, expire, token, publicKey } = authParams;
        try {
            const uploadResponse = await upload({
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name,
                abortSignal: abortController.signal,
            });
            return uploadResponse;
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Error occured while uploading the files.");
        }
        return null;
    };

    const onSubmit = async (data: BookForm) => {
        setIsBookUpdating(true);

        let authParams;
        try {
            authParams = await authenticator();
        } catch (authError) {
            console.error("Failed to authenticate for upload:", authError);
            setIsBookUpdating(false);
            return;
        }

        let imageUploadResponse;
        if (data.image instanceof File) {
            imageUploadResponse = await handleUpload(data.image, authParams);
            if (!imageUploadResponse) {
                setIsBookUpdating(false);
                return;
            }
        }

        let PDF_UploadResponse;
        if (data.isOnline && data.onlineFile instanceof File) {
            PDF_UploadResponse = await handleUpload(data.onlineFile, authParams);
            if (!PDF_UploadResponse) {
                setIsBookUpdating(false);
                return;
            }
        }

        mutation.mutate({
            formData: {
                ...data,
                image: imageUploadResponse?.url || existingImage,
                onlineFileUrl: PDF_UploadResponse?.url || bookData?.onlineFileUrl,
            },
            token,
            bookId: bookId!
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl px-8 py-8 min-h-screen">
            <title>Edit Book - GICCL | Library</title>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Book Number</label>
                <Input placeholder="Enter the book number" {...register('bookNumber')} disabled={mutation.isPending || isBookUpdating} />
                {errors.bookNumber && <p className='text-sm text-red-500'>{errors.bookNumber.message}</p>}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">ISBN <span className="text-gray-400 text-sm font-normal">(optional)</span></label>
                <Input placeholder="e.g. 978-3-16-148410-0" {...register('isbn')} disabled={mutation.isPending || isBookUpdating} />
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Book Name</label>
                <Input placeholder="Enter the book name" {...register('bookName')} disabled={mutation.isPending || isBookUpdating} />
                {errors.bookName && <p className='text-sm text-red-500'>{errors.bookName.message}</p>}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Author</label>
                <Input placeholder="Enter the author name" {...register('author')} disabled={mutation.isPending || isBookUpdating} />
                {errors.author && <p className='text-sm text-red-500'>{errors.author.message}</p>}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Genre</label>
                <Input placeholder="Enter the genre of the book" {...register('genre')} disabled={mutation.isPending || isBookUpdating} />
                {errors.genre && <p className='text-sm text-red-500'>{errors.genre.message}</p>}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Total number of books</label>
                <Input type="number" placeholder="Enter the total number of books" {...register('totalBooks', { required: "Enter total number of books available." })} disabled={mutation.isPending || isBookUpdating} />
                {errors.totalBooks && <p className='text-sm text-red-500'>{errors.totalBooks.message}</p>}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Almirah number</label>
                <Input type="number" placeholder="Enter the almirah number" {...register('almirahNumber', { required: "Enter almirah number." })} disabled={mutation.isPending || isBookUpdating} />
                {errors.almirahNumber && <p className='text-sm text-red-500'>{errors.almirahNumber.message}</p>}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Shelf number</label>
                <Input type="number" placeholder="Enter the shelf number" {...register('shelfNumber', { required: "Enter shelf number." })} disabled={mutation.isPending || isBookUpdating} />
                {errors.shelfNumber && <p className='text-sm text-red-500'>{errors.shelfNumber.message}</p>}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Book Cover Image</label>
                <Controller
                    name='image'
                    control={control}
                    render={({ field }) => (
                        <Input type="file" accept="image/*" disabled={mutation.isPending || isBookUpdating}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const file = e?.target?.files?.[0];
                                field.onChange(file);
                                // Re-derive the spine colour when the cover is replaced
                                pickColorFromCover(file);
                            }}
                        />
                    )}
                />
                {errors.image && <p className='text-sm text-red-500'>{errors.image.message?.toString()}</p>}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Book Primary Color</label>
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50/60 px-3 py-2.5">
                    <label htmlFor="color" className="shrink-0 cursor-pointer" title="Click to change">
                        <Input
                            type="color"
                            id="color"
                            className="h-9 w-9 cursor-pointer p-0 border-none bg-transparent"
                            {...register('bgColor')}
                            disabled={mutation.isPending || isBookUpdating}
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

                    {!isPickingColor && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="shrink-0 gap-1.5 text-gray-600"
                            onClick={() => pickColorFromCover(watch('image') || bookData?.image)}
                            disabled={mutation.isPending || isBookUpdating}
                        >
                            <Wand2 className="h-3.5 w-3.5" />
                            Pick from cover
                        </Button>
                    )}
                </div>
                {errors.bgColor && <p className='text-sm text-red-500'>{errors.bgColor.message}</p>}
            </div>

            {(watch('image') || existingImage) && (<>
                <div className="mb-2">
                    <label className="block mb-1 font-medium">Book Preview</label>
                </div>
                <div className='mb-5'>
                    <BookPreview
                        coverColor={watch('bgColor')}
                        coverImage={watch('image') ? URL.createObjectURL(watch('image')) : existingImage}
                    />
                </div>
            </>)}

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
                            disabled={mutation.isPending || isBookUpdating}
                        />
                    )}
                />
                {errors.summary && <p className='text-sm text-red-500'>{errors.summary.message}</p>}
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
                                disabled={mutation.isPending || isBookUpdating}
                            />
                            <span className="text-sm">This book also has a digital (PDF) copy students can read online</span>
                        </div>
                    </div>

                    {field.value &&
                        <div className="mb-5">
                            <label className="block mb-1 font-medium">Upload PDF</label>
                            <Input type="file" accept="pdf/*" {...register('onlineFile')} disabled={mutation.isPending || isBookUpdating} />
                            {errors.onlineFile && <p className='text-sm text-red-500'>{errors.onlineFile.message?.toString()}</p>}
                        </div>
                    }
                </>)}
            />

            <Button type="submit" className="w-full bg-[#283A8A] text-white mt-4" disabled={mutation.isPending || isBookUpdating}>
                {mutation.isPending || isBookUpdating ? 'Updating...' : 'Update Book'}
            </Button>
        </form>
    );
};

export default memo(EditBookForm);

const BookPreview = ({ coverColor, coverImage }: { coverColor: string, coverImage: string }) => {
    return (
        <div>
            <BookCover coverColor={coverColor} coverImage={coverImage} variant='medium' />
        </div>
    )
}
