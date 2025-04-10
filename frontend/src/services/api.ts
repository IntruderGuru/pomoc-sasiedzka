import axios from 'axios';

const api = axios.create({
    baseURL: 'https://backend.pl/api',
});

export const registerUser = (data: { email: string; password: string }) =>
    api.post('/register', data);

export const loginUser = (data: { email: string; password: string }) =>
    api.post('/login', data);

export const setToken = (token: string) => {
    localStorage.setItem('token', token);
};

export const getToken = () => localStorage.getItem('token');

export default api;
