import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api', // базовый URL для всех запросов
    withCredentials: true,                // если необходимо передавать куки
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;