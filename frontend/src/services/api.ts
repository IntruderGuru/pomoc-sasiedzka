import axios from 'axios';
import { set } from 'react-hook-form';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export const registerUser = (data: { email: string; password: string; username: string }) =>
  api.post('/auth/register', data);

export const loginUser = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const setuserId = (userId: string) => {
  localStorage.setItem('userId', userId);
};

export const setUsername = (username: string) => {
  localStorage.setItem('username', username);
}

export const getToken = () => localStorage.getItem('token');
export const getuserId = () => localStorage.getItem('userId');
export const getUsername = () => localStorage.getItem('username');

export default api;
