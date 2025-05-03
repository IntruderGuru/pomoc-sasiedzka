import axios from 'axios';
import { getToken } from './api.ts';
import { UUID } from 'crypto';

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

export const fetchComments = (id: UUID) => api.get(`/announcements/${id}/comments`);

export const addComment = (id: UUID ,content: string) => api.post(`/announcements/${id}/comments`, content);

export const deleteComment = (id: UUID) => api.delete(`/comments/${id}`);
