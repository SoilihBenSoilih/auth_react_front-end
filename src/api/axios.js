import axios from 'axios';
const baseURL = 'https://bendrick.pythonanywhere.com'



const axiosPrivate = axios.create({
    baseURL: baseURL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export default axiosPrivate