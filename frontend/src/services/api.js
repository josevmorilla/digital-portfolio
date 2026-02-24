import axios from 'axios';

// Prefer explicit API base URL (e.g., VITE_API_URL in Docker), fall back to proxied /api in dev
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Base URL for serving uploaded files (strips /api suffix from API_URL)
const BACKEND_URL = API_URL.replace(/\/api\/?$/, '');

/**
 * Convert a relative upload path (e.g. /uploads/projects/img.png) to a full URL
 * pointing at the backend server. Returns the original value if it's already absolute.
 */
export const getUploadUrl = (path) => {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

// Profile
export const profileAPI = {
  get: () => axios.get(`${API_URL}/profile`),
  update: (data) => axios.put(`${API_URL}/profile`, data),
};

// Skills
export const skillsAPI = {
  getAll: () => axios.get(`${API_URL}/skills`),
  getById: (id) => axios.get(`${API_URL}/skills/${id}`),
  create: (data) => axios.post(`${API_URL}/skills`, data),
  update: (id, data) => axios.put(`${API_URL}/skills/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/skills/${id}`),
};

// Category Settings
export const categorySettingsAPI = {
  getAll: () => axios.get(`${API_URL}/category-settings`),
  updateAll: (settings) => axios.put(`${API_URL}/category-settings`, { settings }),
};

// Projects
export const projectsAPI = {
  getAll: (featured) => axios.get(`${API_URL}/projects${featured ? '?featured=true' : ''}`),
  getById: (id) => axios.get(`${API_URL}/projects/${id}`),
  create: (data) => axios.post(`${API_URL}/projects`, data),
  update: (id, data) => axios.put(`${API_URL}/projects/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/projects/${id}`),
  uploadImage: (formData) => axios.post(`${API_URL}/projects/upload-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Work Experience
export const workExperienceAPI = {
  getAll: () => axios.get(`${API_URL}/work-experience`),
  getById: (id) => axios.get(`${API_URL}/work-experience/${id}`),
  create: (data) => axios.post(`${API_URL}/work-experience`, data),
  update: (id, data) => axios.put(`${API_URL}/work-experience/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/work-experience/${id}`),
};

// Education
export const educationAPI = {
  getAll: () => axios.get(`${API_URL}/education`),
  getById: (id) => axios.get(`${API_URL}/education/${id}`),
  create: (data) => axios.post(`${API_URL}/education`, data),
  update: (id, data) => axios.put(`${API_URL}/education/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/education/${id}`),
};

// Contact Info
export const contactInfoAPI = {
  getAll: () => axios.get(`${API_URL}/contact-info`),
  getById: (id) => axios.get(`${API_URL}/contact-info/${id}`),
  create: (data) => axios.post(`${API_URL}/contact-info`, data),
  update: (id, data) => axios.put(`${API_URL}/contact-info/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/contact-info/${id}`),
};

// Hobbies
export const hobbiesAPI = {
  getAll: () => axios.get(`${API_URL}/hobbies`),
  getById: (id) => axios.get(`${API_URL}/hobbies/${id}`),
  create: (data) => axios.post(`${API_URL}/hobbies`, data),
  update: (id, data) => axios.put(`${API_URL}/hobbies/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/hobbies/${id}`),
  uploadImage: (formData) => axios.post(`${API_URL}/hobbies/upload-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Testimonials
export const testimonialsAPI = {
  getAll: () => axios.get(`${API_URL}/testimonials`),
  getById: (id) => axios.get(`${API_URL}/testimonials/${id}`),
  create: (data) => axios.post(`${API_URL}/testimonials`, data),
  update: (id, data) => axios.put(`${API_URL}/testimonials/${id}`, data),
  approve: (id) => axios.post(`${API_URL}/testimonials/${id}/approve`),
  reject: (id) => axios.post(`${API_URL}/testimonials/${id}/reject`),
  delete: (id) => axios.delete(`${API_URL}/testimonials/${id}`),
};

// Contact Messages
export const contactMessagesAPI = {
  getAll: () => axios.get(`${API_URL}/contact-messages`),
  getById: (id) => axios.get(`${API_URL}/contact-messages/${id}`),
  create: (data) => axios.post(`${API_URL}/contact-messages`, data),
  update: (id, data) => axios.put(`${API_URL}/contact-messages/${id}`, data),
  markAsRead: (id) => axios.post(`${API_URL}/contact-messages/${id}/read`),
  markAsUnread: (id) => axios.post(`${API_URL}/contact-messages/${id}/unread`),
  delete: (id) => axios.delete(`${API_URL}/contact-messages/${id}`),
  getUnreadCount: () => axios.get(`${API_URL}/contact-messages/unread-count`),
};

// Resumes
export const resumesAPI = {
  getAll: () => axios.get(`${API_URL}/resumes`),
  getCurrentByLanguage: (language) => axios.get(`${API_URL}/resumes/current/${language}`),
  download: (id) => `${API_URL}/resumes/${id}/download`,
  create: (data) => axios.post(`${API_URL}/resumes`, data),
  upload: (formData) => axios.post(`${API_URL}/resumes`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => axios.put(`${API_URL}/resumes/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/resumes/${id}`),
};
