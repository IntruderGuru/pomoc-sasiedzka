import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api/auth',
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
