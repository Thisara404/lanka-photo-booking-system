const express = require('express');
const { 
  getBlogs, 
  getBlog, 
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');
const { protect, admin } = require('../middlewares/authMiddleware');
const { blogUpload } = require('../utils/imageProcessing');

const router = express.Router();

// Public routes
router.get('/', getBlogs);
router.get('/:slug', getBlog);

// Admin routes
router.post('/', protect, admin, blogUpload.single('image'), createBlog);
router.put('/:id', protect, admin, blogUpload.single('image'), updateBlog);
router.delete('/:id', protect, admin, deleteBlog);

module.exports = router;