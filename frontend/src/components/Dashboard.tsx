import { useNavigate } from 'react-router-dom'
import { logout } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function Dashboard() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { user } = useAppSelector(state => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    const getInitials = (name: string | undefined): string => {
        return name
            ?.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U'
    }

    return (
        <div>
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <Avatar>
                                    <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                    <p className="text-sm text-gray-500">{user?.email}</p>
                                </div>
                            </div>
                            <Button variant="outline" className={"cursor-pointer"} onClick={handleLogout}>
                                Đăng xuất
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}