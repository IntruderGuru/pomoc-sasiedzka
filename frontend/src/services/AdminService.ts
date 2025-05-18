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


export const fetchUsers = () => api.get('/admin/users');

export const updateRole = (id: UUID, data: { role: string }) => api.put(`/admin/users/${id}/role`, data);

export const deactivateUser = (id: UUID) => api.get(`/admin/users/${id}/deactivate`);

export const fetchCategories = () =>
    api.get(`/admin/categories`);

export const createCategory = (data: { name: string }) =>
    api.post('/admin/categories', data);

export const updateCategory = (id: UUID, data: { name: string }) =>
    api.put(`/admin/categories/${id}`, data);

export const removeCategory = (id: UUID) => api.delete(`/admin/categories/${id}`);

export const fetchAnnouncementsMod = () =>
    api.get(`/admin/announcements`);

export const updateAnnouncementStatus = (id: UUID, data: { status: string }) =>
    api.put(`/admin/announcements/${id}/status`, data);

export const fetchCommentsMod = () =>
    api.get(`/admin/comments`);

export const removeComment = (id: UUID) => api.delete(`/admin/comments/${id}`);

export const fetchDashboard = () => api.get(`/admin/dashboard`);