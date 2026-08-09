import { memo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/AxiosCalls'
import { AxiosError } from 'axios'

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    collegeCode: z.string().min(1, 'College code is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

const Login = () => {
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm<LoginFormData>({
        defaultValues: {
            collegeCode: window?.origin?.split("https://")?.[1]?.split(".")?.[0] || 'GICCL',
            email: '',
            password: '',
        },
        resolver: zodResolver(loginSchema),
    })

    const loginMutation = useMutation({
        mutationKey: ['login'],
        mutationFn: async (data: LoginFormData) => {
            const response = await api.post('/api/admin/login', data);
            return response.data
        },
        onError: (err: AxiosError<{ message: string }>) => {
            setError("root", { message: err.response?.data?.message });
        },
        onSuccess: (data: { token: string, message: string }) => {
            // Handle successful login
            localStorage.setItem('adminToken', data.token)
            navigate('/')
        },
    })

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate(data)
    }

    return (
        <div className='h-screen max-h-[750px] items-center grid lg:grid-cols-2 grid-cols-1 bg-[#0A0A0F] text-white'>
            <title>Login - GICCL | Library</title>
            <div className='w-full h-full flex items-center justify-center'>
                <div className='formBg w-[94vw] max-w-lg sm:w-lg lg:max-w-[45vw] space-y-6 py-8 sm:py-10 px-7 sm:px-10 rounded-lg'>
                    <div>
                        <div className='flex items-center gap-2 mb-8'>
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className='text-2xl font-semibold'>GICCL - Library</span>
                        </div>
                        <div>
                            <h2 className='text-2xl font-semibold'>
                                Welcome Back to the GICCL - Library
                            </h2>
                            <p className='text-gray-400 text-sm'>
                                Manage the vast collection of resources, and stay organized
                            </p>
                        </div>
                    </div>
                    <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
                        <div className='space-y-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='email' className='block text-sm font-medium opacity-70'>
                                    Email
                                </Label>
                                <Input
                                    {...register('email')}
                                    id='email'
                                    type='email'
                                    className='w-full h-11 px-3 py-2 bg-[#1C1C24] border border-gray-800 rounded-[6px] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='adrian@jsmastery.pro'
                                />
                                {errors.email && (
                                    <p className='text-sm text-red-500'>{errors.email.message}</p>
                                )}
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='password' className='block text-sm font-medium opacity-70'>
                                    Password
                                </Label>
                                <Input
                                    {...register('password')}
                                    id='password'
                                    type='password'
                                    className='w-full h-11 px-3 py-2 bg-[#1C1C24] border border-gray-800 rounded-[6px] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Enter your password'
                                />
                                {errors.password && (
                                    <p className='text-sm text-red-500'>{errors.password?.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            {(!errors.email && !errors.password && errors.root) && (
                                <p className='text-sm text-red-500 pb-0.5'>{errors.root?.message}</p>
                            )}
                            <Button
                                type='submit'
                                disabled={loginMutation.isPending}
                                className='w-full h-11 rounded-[6px]'
                            >
                                {loginMutation.isPending ? (
                                    <span className='flex items-center justify-center'>
                                        <svg className='animate-spin -ml-1 mr-3 h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    'Login'
                                )}
                            </Button>
                        </div>

                        <p className='text-center text-sm text-gray-400'>
                            Don't have an account?{' '}
                            <Link to='/register' className='hover:underline text-gray-200'>
                                Register here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
            <div className='w-full h-full overflow-hidden hidden lg:block'>
                <img src="/AuthSideBg.webp" alt="AuthSideBg" className='w-full h-full object-cover object-center' />
            </div>
        </div>
    )
}

export default memo(Login)