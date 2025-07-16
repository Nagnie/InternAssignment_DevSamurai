import { useState } from 'react'
import { useUserStats } from '../hooks/useUserStats'
import { useUsersList } from '../hooks/useUsersList'
import { Badge } from '@/components/ui/badge'
import StatsCards from './StatsCards'
import UserChart from './UserChart'
import UsersTable from './UserTable'

const Dashboard: React.FC = () => {
    const [page, setPage] = useState(1)
    const limit = 5
    const { data: userStats, isLoading: statsLoading, error: statsError } = useUserStats()
    const { data: usersList, isLoading: usersLoading, error: usersError } = useUsersList({
        page,
        limit
    })

    if (statsLoading || usersLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (statsError || usersError) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-500">Error loading dashboard data</div>
            </div>
        )
    }

    const stats = userStats?.data
    const users = usersList?.data

    return (
        <div className="max-w-screen p-6 space-y-6">
            <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-sm">
                    Last updated: {new Date().toLocaleString('vi-VN')}
                </Badge>
            </div>

            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Chart Section */}
            <UserChart stats={stats} />

            {/* Users Table */}
            <UsersTable users={users} page={page} setPage={setPage} />
        </div>
    )
}

export default Dashboard