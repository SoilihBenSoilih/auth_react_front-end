import axios from 'axios';
const baseURL = 'http://54.234.147.153:8080'



const axiosPrivate = axios.create({
    baseURL: baseURL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export default axiosPrivate