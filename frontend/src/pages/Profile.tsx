import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {User, Lock, Mail, Eye, EyeOff, Loader2, PenLine} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useChangePassword, useUpdateProfile, useMe } from '../hooks/useProfile'
import { changePasswordSchema, updateProfileSchema, type ChangePasswordFormData, type UpdateProfileFormData } from '../schemas/profile'
import {useEffect, useState} from "react";
import {Input} from "@/components/ui/input.tsx";
import {Toaster} from "react-hot-toast";

const Profile = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Fetch current user data
    const { data: user, isLoading: userLoading, error: userError } = useMe()

    const changePasswordMutation = useChangePassword()
    const updateProfileMutation = useUpdateProfile()

    const profileForm = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: '',
            email: ''
        }
    })

    const passwordForm = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        }
    })

    // Update form values when user data is loaded
    useEffect(() => {
        if (user) {
            profileForm.reset({
                name: user.name || '',
                email: user.email || ''
            })
        }
    }, [user, profileForm])

    const onUpdateProfile = (data: UpdateProfileFormData) => {
        updateProfileMutation.mutate(data)
    }

    const onChangePassword = (data: ChangePasswordFormData) => {
        changePasswordMutation.mutate({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
        }, {
            onSuccess: () => {
                passwordForm.reset()
            }
        })
    }

    // Loading state
    if (userLoading) {
        return (
            <div className="flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (userError || !user) {
        return (
            <div className="flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
                        <p className="text-red-600">Failed to load profile data</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 text-sm text-red-700 underline hover:no-underline"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="py-8">
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">Profile Settings</h1>
                    <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Profile Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Profile Information
                            </h2>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                {/* Name Field */}
                                <div>
                                    <Label className="block text-sm font-medium mb-2">
                                        Full Name
                                    </Label>
                                    <div className={"relative"}>
                                        <PenLine className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input
                                        {...profileForm.register('name')}
                                        type="text"
                                        className="w-full ps-10 pe-3 border border-gray-300 rounded-lg focus:outline-none"
                                        placeholder="Enter your full name"
                                    />
                                        {profileForm.formState.errors.name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {profileForm.formState.errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                </div>

                                {/* Email Field */}
                                <div>
                                    <Label className="block text-sm font-medium mb-2">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            {...profileForm.register('email')}
                                            type="email"
                                            className="w-full ps-10 pe-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                                            placeholder="Enter your email"
                                        />

                                    </div>
                                    {profileForm.formState.errors.email && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {profileForm.formState.errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Account Info */}
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Member since: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Button
                                    onClick={profileForm.handleSubmit(onUpdateProfile)}
                                    disabled={updateProfileMutation.isPending}
                                    className="w-full text-white py-2 px-4 rounded-lg"
                                >
                                    {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <Lock className="w-5 h-5" />
                                Change Password
                            </h2>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                {/* Current Password */}
                                <div>
                                    <Label className="block text-sm font-medium mb-2">
                                        Current Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className={"absolute left-3 top-2.5 h-4 w-4 text-gray-400"}/>
                                        <Input
                                            {...passwordForm.register('currentPassword')}
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            className="ps-9 pe-9 py-2 border border-gray-300 rounded-lg focus:outline-none"
                                            placeholder="Enter current password"
                                        />
                                        <span
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                                        >
                                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </span>
                                    </div>
                                    {passwordForm.formState.errors.currentPassword && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {passwordForm.formState.errors.currentPassword.message}
                                        </p>
                                    )}
                                </div>

                                {/* New Password */}
                                <div>
                                    <Label className="block text-sm font-medium mb-2">
                                        New Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className={"absolute left-3 top-2.5 h-4 w-4 text-gray-400"}/>
                                        <Input
                                            {...passwordForm.register('newPassword')}
                                            type={showNewPassword ? 'text' : 'password'}
                                            className="ps-9 pe-9 py-2 border border-gray-300 rounded-lg focus:outline-none"
                                            placeholder="Enter new password"
                                        />
                                        <span
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                                        >
                                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </span>
                                    </div>
                                    {passwordForm.formState.errors.newPassword && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {passwordForm.formState.errors.newPassword.message}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm New Password */}
                                <div>
                                    <Label className="block text-sm font-medium mb-2">
                                        Confirm New Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className={"absolute left-3 top-2.5 h-4 w-4 text-gray-400"}/>
                                        <Input
                                            {...passwordForm.register('confirmNewPassword')}
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            className="w-full ps-9 pe-9 border border-gray-300 rounded-lg focus:outline-none"
                                            placeholder="Confirm new password"
                                        />
                                        <span
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </span>
                                    </div>
                                    {passwordForm.formState.errors.confirmNewPassword && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {passwordForm.formState.errors.confirmNewPassword.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6">
                                <Button
                                    onClick={passwordForm.handleSubmit(onChangePassword)}
                                    disabled={changePasswordMutation.isPending}
                                    className="w-full"
                                >
                                    {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile