import { useQuery } from '@tanstack/react-query'
import { dashboardAPI } from '../services/api'

export const useUserStats = () => {
    return useQuery({
        queryKey: ['userStats'],
        queryFn: dashboardAPI.getUserStats,
    })
}
