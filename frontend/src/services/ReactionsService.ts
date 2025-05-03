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

export const addReaction = (targetType: string, targetId: UUID) => {
    if (targetType == 'comment') {
        api.post(`/comments/${targetId}/reactions`);
    } else {
        api.post(`/announcements/${targetId}/reactions`);
    }
}

export const removeReaction = (targetType: string, targetId: UUID) => {
    if (targetType == 'comment') {
        api.delete(`/comments/${targetId}/reactions`);
    } else {
        api.delete(`/announcements/${targetId}/reactions`);
    }
}

