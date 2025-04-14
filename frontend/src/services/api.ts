import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export const registerUser = (data: { email: string; password: string }) =>
  api.post('/auth/register', data);

export const loginUser = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const getToken = () => localStorage.getItem('token');

export default api;
