const express = require('express');
const { 
  getGalleries,
  getFeaturedGalleries,
  getGalleriesByCategory, 
  getGallery, 
  createGallery,
  updateGallery,
  deleteGallery,
  addPhoto,
  deletePhoto
} = require('../controllers/galleryController');
const { protect, admin } = require('../middlewares/authMiddleware');
const { galleryUpload, photoUpload } = require('../utils/imageProcessing');

const router = express.Router();

// Public routes
router.get('/', getGalleries);
router.get('/featured', getFeaturedGalleries);
router.get('/category/:category', getGalleriesByCategory);
router.get('/:slug', getGallery);

// Admin routes
router.post('/', protect, admin, galleryUpload.single('coverImage'), createGallery);
router.put('/:id', protect, admin, galleryUpload.single('coverImage'), updateGallery);
router.delete('/:id', protect, admin, deleteGallery);
router.post('/:id/photos', protect, admin, photoUpload.single('image'), addPhoto);
router.delete('/photos/:id', protect, admin, deletePhoto);

module.exports = router;