// Merkezi API konfigürasyonu
export const API_CONFIG = {
  // Development
  development: {
    baseURL: 'http://localhost:5000',
    apiPath: '/api'
  },
  // Production
  production: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://ofy-portfolio-h97t.vercel.app',
    apiPath: '/api'
  }
};

// Environment'a göre API URL'ini belirle
const getApiConfig = () => {
  // Debug için console.log
  console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
  
  // Vercel deployment'da production, local'de development
  const env = import.meta.env.VITE_API_BASE_URL?.includes('localhost') ? 'development' : 'production';
  console.log('Selected env:', env);
  return API_CONFIG[env as keyof typeof API_CONFIG] || API_CONFIG.development;
};

// Merkezi API base URL
export const API_BASE_URL = `${getApiConfig().baseURL}${getApiConfig().apiPath}`;

// API endpoint'leri
export const API_ENDPOINTS = {
  // Auth
  auth: '/auth',
  
  // About
  about: '/about',
  aboutGallery: '/about-gallery',
  
  // Projects
  projects: '/projects',
  
  // News
  news: '/news',
  
  // Intro Banners
  introBanners: '/intro-banners',
  
  // Awards
  awards: '/awards',
  
  // Slider
  slider: '/slider',
  
  // What We Do
  whatWeDo: '/what-we-do',
  
  // Contact
  contact: '/contact'
} as const;

// Tam API URL'lerini oluştur
export const getApiUrl = (endpoint: keyof typeof API_ENDPOINTS) => {
  return `${API_BASE_URL}${API_ENDPOINTS[endpoint]}`;
};

// Axios instance için base URL
export const axiosBaseURL = API_BASE_URL;
