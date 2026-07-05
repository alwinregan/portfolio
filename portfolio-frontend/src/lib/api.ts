import axios from 'axios';
import { Project, Skill, Experience, Certification, Blog, Contact } from '@/types/api';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.hasOwnProperty('success')) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    console.error(`[API ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth
export const login = (data: any): Promise<any> => api.post('/auth/login', data);

// Profile
export const getProfile = (): Promise<any> => api.get('/profile');
export const updateProfile = (data: any): Promise<any> => api.put('/admin/profile', data);

// Projects
export const getProjects = (): Promise<Project[]> => api.get('/projects?limit=100');
export const getProjectBySlug = (slug: string): Promise<Project> => api.get(`/projects/${slug}`);
export const getAdminProjects = (): Promise<Project[]> => api.get('/admin/projects');
export const createProject = (data: Partial<Project>): Promise<Project> => api.post('/admin/projects', data);
export const updateProject = (id: string, data: Partial<Project>): Promise<Project> => api.put(`/admin/projects/${id}`, data);
export const deleteProject = (id: string): Promise<{ id: string }> => api.delete(`/admin/projects/${id}`);
export const importProjects = (projects: any[]): Promise<{ created: number; updated: number; failed: number; errors: string[] }> => api.post('/admin/projects/import', projects);

// Skills
export const getSkills = (category?: string): Promise<Skill[]> => api.get('/skills', { params: { category } });
export const getAdminSkills = (): Promise<Skill[]> => api.get('/admin/skills');
export const createSkill = (data: Partial<Skill>): Promise<Skill> => api.post('/admin/skills', data);
export const updateSkill = (id: string, data: Partial<Skill>): Promise<Skill> => api.put(`/admin/skills/${id}`, data);
export const toggleSkill = (id: string): Promise<Skill> => api.patch(`/admin/skills/${id}/toggle`);
export const deleteSkill = (id: string): Promise<{ id: string }> => api.delete(`/admin/skills/${id}`);

// Experience
export const getExperiences = (): Promise<Experience[]> => api.get('/experience');
export const getAdminExperiences = (): Promise<Experience[]> => api.get('/admin/experience');
export const createExperience = (data: Partial<Experience>): Promise<Experience> => api.post('/admin/experience', data);
export const updateExperience = (id: string, data: Partial<Experience>): Promise<Experience> => api.put(`/admin/experience/${id}`, data);
export const deleteExperience = (id: string): Promise<{ id: string }> => api.delete(`/admin/experience/${id}`);

// Certifications
export const getCertifications = (): Promise<Certification[]> => api.get('/certifications');
export const getAdminCertifications = (): Promise<Certification[]> => api.get('/admin/certifications');
export const createCertification = (data: Partial<Certification>): Promise<Certification> => api.post('/admin/certifications', data);
export const updateCertification = (id: string, data: Partial<Certification>): Promise<Certification> => api.put(`/admin/certifications/${id}`, data);
export const deleteCertification = (id: string): Promise<{ id: string }> => api.delete(`/admin/certifications/${id}`);

// Settings
export const getSettings = (): Promise<any> => api.get('/settings');
export const updateSettings = (data: any): Promise<any> => api.put('/admin/settings', data);
export const updateToggles = (toggles: Record<string, boolean>): Promise<any> => api.put('/admin/settings/toggles', toggles);

// Blog
export const getBlogs = (): Promise<Blog[]> => api.get('/blog');
export const getAdminBlogs = (): Promise<Blog[]> => api.get('/blog?role=admin');
export const createBlog = (data: Partial<Blog>): Promise<Blog> => api.post('/blog', data);
export const getBlogBySlug = (slug: string): Promise<Blog> => api.get(`/blog/${slug}`);
export const updateBlog = (id: string, data: Partial<Blog>): Promise<Blog> => api.patch(`/blog/${id}`, data);
export const deleteBlog = (id: string): Promise<{ id: string }> => api.delete(`/blog/${id}`);

// Uploads
export const uploadImage = (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/uploads/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const getUploadedFiles = (): Promise<any> => api.get('/uploads');
export const deleteUploadedFile = (filename: string): Promise<any> => api.delete(`/uploads/${filename}`);

// Apps
export const getApps = (): Promise<any[]> => api.get('/apps');
export const getAdminApps = (): Promise<any[]> => api.get('/admin/apps');
export const createApp = (data: any): Promise<any> => api.post('/admin/apps', data);
export const updateApp = (id: string, data: any): Promise<any> => api.put(`/admin/apps/${id}`, data);
export const deleteApp = (id: string): Promise<{ id: string }> => api.delete(`/admin/apps/${id}`);

// Export / Import (bulk data transfer between environments)
export const exportAll = (): Promise<any> => api.get('/admin/export');
export const importAll = (data: any): Promise<any> => api.post('/admin/import', data);
export const exportModule = (type: string): Promise<any> => api.get(`/admin/export?type=${type}`);
export const importModule = (type: string, data: any): Promise<any> => api.post(`/admin/import?type=${type}`, data);

// Contact
export const sendContactMessage = (data: Partial<Contact>): Promise<Contact> => api.post('/contact', data);
export const getAdminContacts = (): Promise<Contact[]> => api.get('/admin/contact');
export const updateContactStatus = (id: string, status: string): Promise<Contact> => api.patch(`/admin/contact/${id}`, { status });
export const deleteContact = (id: string): Promise<{ id: string }> => api.delete(`/admin/contact/${id}`);
