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

export const fetchAll = () => api.get('/announcements');

export const fetchAllForAdmin = () => api.get('/admin/announcements');

export const fetchByUser = (id: UUID) => api.get(`/users/${id}/announcements`);

export const fetchById = (id: UUID) => api.get(`/announcements/${id}`);

export const create = (data: { title: string; content: string; category: string; type:string }) =>
  api.post('/announcements', data);

export const update = (id: UUID, data: { title: string; content: string; category: string; type:string }) =>
  axios.put(`/announcements/${id}`, data);

export const remove = (id: UUID) => api.delete(`/announcements/${id}`);
