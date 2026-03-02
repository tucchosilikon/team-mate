import axios from 'axios';

const isProduction = typeof window !== 'undefined' && window.location.hostname.includes('onrender');
console.log('[axios] isProduction:', isProduction, 'hostname:', typeof window !== 'undefined' ? window.location.hostname : 'N/A');
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
        console.log('[axios] Request to:', config.url);
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        console.log('[axios] Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.log('[axios] Error:', error.message, error.code, error.response?.status, error.config?.url);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // Don't redirect automatically - let the component handle it
        }
        return Promise.reject(error);
    }
);

export default api;
