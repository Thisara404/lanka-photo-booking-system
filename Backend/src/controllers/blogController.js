const Blog = require('../models/Blog');
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public
const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

// @desc    Get single blog post
// @route   GET /api/blog/:slug
// @access  Public
const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });

  if (blog) {
    res.json(blog);
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
});

// @desc    Create blog post
// @route   POST /api/blog
// @access  Private/Admin
const createBlog = asyncHandler(async (req, res) => {
  console.log('Creating blog post with data:', req.body);
  console.log('File:', req.file);
  
  // Validate required fields
  if (!req.body.title || !req.body.content) {
    res.status(400);
    throw new Error('Title and content are required');
  }
  
  // Check if there's an image (either uploaded or URL)
  let imagePath = null;
  if (req.file) {
    // If file was uploaded, use its path
    imagePath = req.file.path.replace(/\\/g, '/');
  } else if (req.body.imageUrl) {
    // If imageUrl was provided, use that
    imagePath = req.body.imageUrl;
  } else {
    res.status(400);
    throw new Error('Please provide an image (upload or URL)');
  }
  
  // Sanitize excerpt to ensure it doesn't exceed 250 characters
  const excerpt = req.body.excerpt 
    ? req.body.excerpt.substring(0, 250)
    : req.body.content.substring(0, 240) + '...';
  
  try {
    const blog = await Blog.create({
      title: req.body.title,
      content: req.body.content,
      excerpt: excerpt, // Use our sanitized excerpt
      category: req.body.category || 'uncategorized',
      image: imagePath,
      author: req.body.author || 'Chamodya Kodagoda',
      readTime: req.body.readTime || '5 min read',
      published: req.body.published === 'true' || req.body.published === true
    });
    
    console.log('Blog created successfully:', blog);
    res.status(201).json(blog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500);
    throw new Error(`Blog creation failed: ${error.message}`);
  }
});

// @desc    Update blog post
// @route   PUT /api/blog/:id
// @access  Private/Admin
const updateBlog = asyncHandler(async (req, res) => {
  let blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  // Handle image upload if new image
  if (req.file) {
    // Remove old image if it exists and is not a URL
    if (blog.image && !blog.image.startsWith('http') && fs.existsSync(path.join(__dirname, '../../', blog.image))) {
      fs.unlinkSync(path.join(__dirname, '../../', blog.image));
    }
    req.body.image = req.file.path.replace(/\\/g, '/');
  }

  blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json(blog);
});

// @desc    Delete blog post
// @route   DELETE /api/blog/:id
// @access  Private/Admin
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  // Delete image file if it exists and is not a URL
  if (blog.image && !blog.image.startsWith('http')) {
    const imagePath = path.join(__dirname, '../../', blog.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await blog.deleteOne();
  res.json({ message: 'Blog removed' });
});

module.exports = {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog
};