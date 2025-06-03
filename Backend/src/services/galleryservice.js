import api from '../api';

const GalleryService = {
  getAllGalleries: () => api.get('/gallery'),
  getFeaturedGalleries: () => api.get('/gallery/featured'),
  getGalleriesByCategory: (category) => api.get(`/gallery/category/${category}`),
  getGalleryBySlug: (slug) => api.get(`/gallery/${slug}`),
};

export default GalleryService;