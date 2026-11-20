import axios from 'axios';

// Ensure the browser passes cross-origin cookies with every request
axios.defaults.withCredentials = true;

// Attach Authorization header automatically if a token exists in localStorage
axios.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (e) {
        // LocalStorage access fallback
    }
    return config;
});

// Dynamic Base URL: Uses VITE_API_URL if set (production/Vercel), otherwise falls back to localhost:8000
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const USER_API_END_POINT = `${BASE_URL}/api/v1/user`;
export const JOB_API_END_POINT = `${BASE_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/api/v1/application`;
export const COMPANY_API_END_POINT = `${BASE_URL}/api/v1/company`;
