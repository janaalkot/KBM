import axios from 'axios';

import type {
  Lesson,
  Department,
  Function,
  Industry,
  CreateLessonDto,
  UpdateLessonDto,
} from '../types';

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'https://localhost:7168/api/v1.0',
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('kbm_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === 'string') {
      return data;
    }

    if (data?.message) {
      return data.message;
    }

    if (data?.title) {
      return data.title;
    }

    if (error.response?.status === 401) {
      return 'You are not authorized. Please log in.';
    }

    if (error.response?.status === 400) {
      return 'The submitted data is invalid.';
    }
  }

  return 'Something went wrong. Please try again.';
};

export const LessonService = {
  getLessons: async (): Promise<Lesson[]> => {
    const response = await API.get<Lesson[]>('/Lesson');
    return response.data;
  },

  getLessonById: async (id: string): Promise<Lesson> => {
    const response = await API.get<Lesson>(`/Lesson/${id}`);
    return response.data;
  },

  createLesson: async (
    data: CreateLessonDto
  ): Promise<Lesson> => {
    const response = await API.post<Lesson>('/Lesson', data);
    return response.data;
  },

  updateLesson: async (
    id: string,
    data: UpdateLessonDto
  ): Promise<void> => {
    await API.put(`/Lesson/${id}`, data);
  },

  deleteLesson: async (id: string): Promise<void> => {
    await API.delete(`/Lesson/${id}`);
  },

  getDepartments: async (): Promise<Department[]> => {
    const response = await API.get<Department[]>(
      '/Lookup/departments'
    );

    return response.data;
  },

  getFunctions: async (): Promise<Function[]> => {
    const response = await API.get<Function[]>(
      '/Lookup/functions'
    );

    return response.data;
  },

  getIndustries: async (): Promise<Industry[]> => {
    const response = await API.get<Industry[]>(
      '/Lookup/industries'
    );

    return response.data;
  },
};

export const AuthService = {
  login: async (
    email: string,
    password: string
  ) => {
    const response = await API.post('/../Auth/login', {
      email,
      password,
    });

    return response.data;
  },
};

export { getErrorMessage };

export default API;