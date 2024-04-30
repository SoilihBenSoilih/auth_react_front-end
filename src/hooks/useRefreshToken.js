import axiosPrivate from '../api/axios'
import useAuth from './useAuth'


export const useRefreshToken = () => {
    const { setAuth, auth } = useAuth()

    const refresh = async () => {
        const response = await axiosPrivate.post('/api/auth/refresh',
            {
                refresh: auth.refreshToken
            },
            {
                headers: {
                    'Authorization': `Bearer ${auth.accessToken}`
                },
                withCredentials: true
            }
        ) 

        setAuth(prev => {
            // console.log(JSON.stringify(prev))
            // console.log(JSON.stringify(response.data.access))
            return { ...prev, accessToken: response.data.access }
        })

        return response.data.accessToken
    }

    return refresh
}
