import axios from 'axios';
import { getToken } from './api.ts';

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
});

api.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const fetchAll = () => api.get('/announcements');

export const fetchById = (id: string) => api.get(`/announcements/:${id}`);

export const create = (data: { title: string, content: string }) => api.post('/announcements', data);

export const update = (id: string, data: { title: string, content: string }) => axios.put(`/announcements/:${id}`, data);

export const remove = (id: string) => api.delete(`/announcements/:${id}`);
