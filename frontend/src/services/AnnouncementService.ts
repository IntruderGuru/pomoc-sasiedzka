import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
});


export const fetchAll = () => api.get('/announcements');

export const fetchById = (id: string) => api.get(`/announcements/:${id}`);

export const create = (data: {title: string, content: string, category: string}) => api.post('/announcements', data);

export const update = (id: string, data: {title: string, content: string, category: string}) => axios.put(`/announcements/:${id}`, data);

export const remove = (id: string) => api.delete(`/announcements/:${id}`);
