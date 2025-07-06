import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import BookCover from '@/components/BookCover';

const bookSchema = z.object({
    title: z.string().min(1, 'Book title is required'),
    author: z.string().min(1, 'Author is required'),
    genre: z.string().min(1, 'Genre is required'),
    total: z.string().min(1, 'Total number of books is required'),
    image: z.any().optional(),
    color: z.string().min(1, 'Primary color is required'),
    video: z.any().optional(),
    summary: z.string().min(1, 'Summary is required'),
});

type BookForm = z.infer<typeof bookSchema>;

const AddNewBookForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<BookForm>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            color: '#000000',
            total: ''
        },
    });

    const mutation = useMutation({
        mutationKey: ["add new book"],
        mutationFn: async (data: BookForm) => {
            // Mock API call
            await new Promise((res) => setTimeout(res, 1000));
            return data;
        },
        onSuccess: () => {
            // handle success (e.g., redirect or show toast)
        },
    });

    const onSubmit = (data: BookForm) => {
        mutation.mutate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl px-8 py-8 min-h-screen">
            <div className="mb-5">
                <label className="block mb-1 font-medium">Book Title</label>
                <Input placeholder="Enter the book title" {...register('title')} />
                {errors.title && (
                    <p className='text-sm text-red-500'>{errors.title.message}</p>
                )}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Author</label>
                <Input placeholder="Enter the author name" {...register('author')} />
                {errors.author && (
                    <p className='text-sm text-red-500'>{errors.author.message}</p>
                )}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Genre</label>
                <Input placeholder="Enter the genre of the book" {...register('genre')} />
                {errors.genre && (
                    <p className='text-sm text-red-500'>{errors.genre.message}</p>
                )}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Total number of books</label>
                <Input type="number" placeholder="Enter the total number of books" {...register('total', { required: "Enter total number of books available." })} />
                {errors.total && (
                    <p className='text-sm text-red-500'>{errors.total.message}</p>
                )}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Book Cover Image</label>
                <Input type="file" accept="image/*" {...register('image')} />
                {errors.image && (
                    <p className='text-sm text-red-500'>{errors.image.message?.toString()}</p>
                )}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Book Primary Color</label>
                <label htmlFor='color' className='flex items-center gap-3'>
                    <Input type="color" id='color' className="w-11 h-11 p-0 border-none bg-transparent" {...register('color')} />
                    <Input value={watch('color')} readOnly className='pointer-events-none' />
                </label>
                {errors.color && (
                    <p className='text-sm text-red-500'>{errors.color.message}</p>
                )}
            </div>
            <div className="mb-5">
                <label className="block mb-1 font-medium">Book Primary Color</label>
            </div>
            {watch('image')?.[0] && (
                <BookPreview 
                    coverColor={watch('color')} 
                    coverImage={watch('image')?.[0] ? URL.createObjectURL(watch('image')[0]) : "https://i.ytimg.com/vi/vS_1611qc0M/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLAWGacPUF3-749Nzu0TFP7m-6xG-A"} 
                />
            )}
            {/* <div className="mb-5">
                    <label className="block mb-1 font-medium">Book Video</label>
                    <Input type="file" accept="video/*" {...register('video')} />
                    {errors.video && (
                        <p className='text-sm text-red-500'>{errors.video.message?.toString()}</p>
                    )}
                </div> */}
            <div className="mb-5">
                <label className="block mb-1 font-medium">Book Summary</label>
                <textarea
                    className="w-full min-h-[120px] border rounded-md p-2 text-sm"
                    placeholder="Write a brief summary of the book"
                    {...register('summary')}
                />
                {errors.summary && (
                    <p className='text-sm text-red-500'>{errors.summary.message}</p>
                )}
            </div>
            <Button type="submit" className="w-full bg-[#283A8A] text-white mt-4" disabled={mutation.isPending}>
                {mutation.isPending ? 'Updating...' : 'Update Book'}
            </Button>
        </form>
    );
};

export default memo(AddNewBookForm);



const BookPreview = ({ coverColor, coverImage }: { coverColor: string, coverImage: string }) => {
    return (
        <div>
            <BookCover coverColor={coverColor} coverImage={coverImage} />
        </div>
    )
}