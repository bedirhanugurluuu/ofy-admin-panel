import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// Merkezi axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Token varsa ekle
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 hatası varsa login sayfasına yönlendir
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// API fonksiyonları
export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login', credentials),

  // About
  getAbout: () => apiClient.get('/about'),
  updateAbout: (data: any) => apiClient.put('/about', data),
  
  getAboutGallery: () => apiClient.get('/about-gallery'),
  updateAboutGallery: (data: any) => apiClient.put('/about-gallery', data),

  // Projects
  getProjects: () => apiClient.get('/projects'),
  getProject: (id: number) => apiClient.get(`/projects/${id}`),
  createProject: (data: any) => apiClient.post('/projects', data),
  updateProject: (id: number, data: any) => apiClient.put(`/projects/${id}`, data),
  deleteProject: (id: number) => apiClient.delete(`/projects/${id}`),

  // News
  getNews: () => apiClient.get('/news'),
  getNewsItem: (id: number) => apiClient.get(`/news/${id}`),
  createNews: (data: any) => apiClient.post('/news', data),
  updateNews: (id: number, data: any) => apiClient.put(`/news/${id}`, data),
  deleteNews: (id: number) => apiClient.delete(`/news/${id}`),

  // Intro Banners
  getIntroBanners: () => apiClient.get('/intro-banners'),
  getIntroBanner: (id: number) => apiClient.get(`/intro-banners/${id}`),
  createIntroBanner: (data: any) => apiClient.post('/intro-banners', data),
  updateIntroBanner: (id: number, data: any) => apiClient.put(`/intro-banners/${id}`, data),
  deleteIntroBanner: (id: number) => apiClient.delete(`/intro-banners/${id}`),

  // Awards
  getAwards: () => apiClient.get('/awards'),
  getAward: (id: number) => apiClient.get(`/awards/${id}`),
  createAward: (data: any) => apiClient.post('/awards', data),
  updateAward: (id: number, data: any) => apiClient.put(`/awards/${id}`, data),
  deleteAward: (id: number) => apiClient.delete(`/awards/${id}`),

  // Slider
  getSlider: () => apiClient.get('/slider'),
  getSliderItem: (id: number) => apiClient.get(`/slider/${id}`),
  createSliderItem: (data: any) => apiClient.post('/slider', data),
  updateSliderItem: (id: number, data: any) => apiClient.put(`/slider/${id}`, data),
  deleteSliderItem: (id: number) => apiClient.delete(`/slider/${id}`),

  // What We Do
  getWhatWeDo: () => apiClient.get('/what-we-do'),
  updateWhatWeDo: (data: any) => apiClient.put('/what-we-do', data),

  // Contact
  getContact: () => apiClient.get('/contact'),
  updateContact: (data: any) => apiClient.put('/contact', data),
};

export default api;
