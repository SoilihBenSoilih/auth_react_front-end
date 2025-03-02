import axiosPrivate from '../api/axios'
import useAuth from './useAuth'
import useApiService from '../service/apiService';


export const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const { post } = useApiService()

    const refresh = async () => {
    
        const response = await post('api/auth/refresh', {},
            {
            withCredentials: true
        });
        setAuth(prev => {
            // console.log(JSON.stringify(prev));
            // console.log(response.data.accessToken);
            console.log(prev);
            return {
                ...prev,
                accessToken: response?.data?.accessToken
            }
        });
        return response.data.accessToken;
    }
    return refresh;
}
