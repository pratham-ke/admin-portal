import apiClient from './apiClient';

interface PortfolioFormData {
  name: string;
  website?: string;
  category: string;
  year?: string;
  overview?: string;
  image?: File | null;
}

const portfolioService = {
  getPortfolioItems: () => {
    return apiClient.get('/portfolio');
  },
  getPortfolioItem: (id: string) => {
    return apiClient.get(`/portfolio/${id}`);
  },
  createPortfolioItem: (data: PortfolioFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('category', data.category);
    if (data.website) formData.append('website', data.website);
    if (data.year) formData.append('year', data.year);
    if (data.overview) formData.append('overview', data.overview);
    if (data.image) {
      formData.append('image', data.image);
    }
    return apiClient.post('/portfolio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updatePortfolioItem: (id: string, data: PortfolioFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('category', data.category);
    if (data.website) formData.append('website', data.website);
    if (data.year) formData.append('year', data.year);
    if (data.overview) formData.append('overview', data.overview);
    if (data.image) {
      formData.append('image', data.image);
    }
    return apiClient.put(`/portfolio/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deletePortfolioItem: (id: string) => {
    return apiClient.delete(`/portfolio/${id}`);
  },
  toggleStatus: (id: string) => {
    return apiClient.patch(`/portfolio/${id}/toggle-status`);
  },
};

export default portfolioService; 