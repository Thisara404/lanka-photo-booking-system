const express = require('express');
const { 
  getProducts,
  getFeaturedProducts,
  getProduct, 
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');
const { productUpload } = require('../utils/imageProcessing');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:slug', getProduct);

// Admin routes
router.post('/', protect, admin, productUpload.single('image'), createProduct);
router.put('/:id', protect, admin, productUpload.single('image'), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;