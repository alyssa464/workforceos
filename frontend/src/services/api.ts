import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getRoles = async () => {
  const response = await api.get('/roles');
  return response.data;
};

export const getRole = async (id: number | string) => {
  const response = await api.get(`/roles/${id}`);
  return response.data;
};

export const scoreAssessment = async (data: any) => {
  const response = await api.post('/assessment/score', data);
  return response.data;
};

export const getAssessment = async (id: number) => {
  const response = await api.get(`/assessment/${id}`);
  return response.data;
};

export default api;
