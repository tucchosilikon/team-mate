import axios from 'axios';

const isProduction = typeof window !== 'undefined' && window.location.hostname.includes('onrender');
const api = axios.create({
    baseURL: isProduction 
        ? 'https://teammate-backend-rk5a.onrender.com/api' 
        : (import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001/api'),
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export default api;
