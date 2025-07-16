import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { signupSchema, type SignupFormData } from '../schemas/auth'
import { authAPI } from '../services/api'
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {AlertCircleIcon, Lock, Mail, User, Eye, EyeOff, RefreshCw, CircleDot} from 'lucide-react'
import { useState } from 'react'

export default function SignUp() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { isLoading, error } = useAppSelector(state => state.auth)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema)
    })

    const onSubmit = async (data: SignupFormData) => {
        dispatch(loginStart())
        try {
            const response = await authAPI.signup({
                name: data.name,
                email: data.email,
                password: data.password
            })

            dispatch(loginSuccess({
                user: response.data.user,
                token: response.data.token
            }))

            navigate('/dashboard')
        } catch (error: any) {
            dispatch(loginFailure(
                error.response?.data?.message || 'Sign up fail. Please try again'
            ))
        }
    }

    return (
        <div className="flex items-center justify-center w-110">
            <Card className="w-full px-4 py-8">
                <CardHeader className="text-start">
                    <CardTitle className="font-bold text-2xl">Create your account</CardTitle>
                    <CardDescription>
                        Please fill in the details to get started.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-start">
                        <div>
                            <Label htmlFor="name" className="font-bold text-base mb-2">Name</Label>
                            <div className="relative mb-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <User size={16} />
                                </span>
                                <Input
                                    id="name"
                                    type="text"
                                    {...register('name')}
                                    placeholder={"John Doe"}
                                    className={`ps-9 ${errors.name ? 'border-red-500' : ''}`}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="email" className="font-bold text-base mb-2">Email</Label>
                            <div className="relative mb-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Mail size={16} />
                                </span>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    placeholder={"abc@example.com"}
                                    className={`ps-9 ${errors.email ? 'border-red-500' : ''}`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="password" className="font-bold text-base mb-2">Password</Label>
                            <div className="relative mb-2">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock size={16} />
                                </span>
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    placeholder={"••••••"}
                                    className={`ps-9 pe-9 ${errors.password ? 'border-red-500' : ''}`}
                                />
                                <span
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </span>
                            </div>
                            {errors.password ? (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            ) : (
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <CircleDot size={16}/>
                                    8 or more characters
                                </div>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword" className="font-bold text-base mb-2">Confirm Password</Label>
                            <div className="relative mb-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock size={16} />
                                </span>
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    {...register('confirmPassword')}
                                    placeholder={"••••••"}
                                    className={`ps-9 pe-9 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                />
                                <span
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </span>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircleIcon />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                            data-testid="create-btn"
                        >
                            {isLoading && (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            )}
                            Create account
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="ms-1 font-bold underline">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}