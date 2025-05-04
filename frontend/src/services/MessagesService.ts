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

export const fetchConversations = () => api.get('/messages/conversations');

export const fetchThread = (withuserId: UUID) => api.get(`/messages/${withuserId}`);

export const sendMessage = (data: { receiverId: UUID, content: string }) => api.post(`/users/messages`, data);
