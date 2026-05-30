import axios from 'axios';
import { getAuthToken } from './auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred.';
}

export interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}

export async function signIn(credentials: AuthCredentials) {
  const response = await api.post('/auth/login', credentials);
  return response.data;
}

export async function register(credentials: AuthCredentials) {
  try {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export function getWorkspaceList() {
  return api.get('/workspaces');
}

export function getWorkspaceSummary(workspaceId: string) {
  return api.get(`/workspaces/${workspaceId}/summary`);
}

export function getProjects(workspaceId?: string) {
  return api.get('/projects', { params: workspaceId ? { workspaceId } : {} });
}

export function getProject(projectId: string) {
  return api.get(`/projects/${projectId}`);
}

export function createProject(data: {
  title: string;
  description?: string;
  workspaceId: string;
  status?: string;
  priority?: string;
  startDate?: string;
  dueDate?: string;
  budget?: number;
  client?: string;
  tags?: string[];
}) {
  return api.post('/projects', data);
}

export default api;
