import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { dashboardAPI, type UsersListParams } from '../services/api'

export const useUsersList = (params?: UsersListParams) => {
    return useQuery({
        queryKey: ['usersList', params],
        queryFn: () => dashboardAPI.getUsers(params),
        placeholderData: keepPreviousData,
    })
}