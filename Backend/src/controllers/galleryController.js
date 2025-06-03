const Gallery = require('../models/Gallery');
const Photo = require('../models/Photo');
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');

// @desc    Get all galleries
// @route   GET /api/gallery
// @access  Public
const getGalleries = asyncHandler(async (req, res) => {
  const galleries = await Gallery.find().sort({ createdAt: -1 });
  res.json(galleries);
});

// @desc    Get featured galleries
// @route   GET /api/gallery/featured
// @access  Public
const getFeaturedGalleries = asyncHandler(async (req, res) => {
  const galleries = await Gallery.find({ featured: true }).sort({ createdAt: -1 });
  res.json(galleries);
});

// @desc    Get galleries by category
// @route   GET /api/gallery/category/:category
// @access  Public
const getGalleriesByCategory = asyncHandler(async (req, res) => {
  const galleries = await Gallery.find({ category: req.params.category }).sort({ createdAt: -1 });
  res.json(galleries);
});

// @desc    Get single gallery
// @route   GET /api/gallery/:slug
// @access  Public
const getGallery = asyncHandler(async (req, res) => {
  const gallery = await Gallery.findOne({ slug: req.params.slug });

  if (!gallery) {
    res.status(404);
    throw new Error('Gallery not found');
  }

  // Get all photos for this gallery
  const photos = await Photo.find({ gallery: gallery._id }).sort({ order: 1 });
  
  res.json({ gallery, photos });
});

// @desc    Create gallery
// @route   POST /api/gallery
// @access  Private/Admin
const createGallery = asyncHandler(async (req, res) => {
  // If an image was uploaded, the path is in req.file.path
  const coverImagePath = req.file ? req.file.path.replace(/\\/g, '/') : null;

  const gallery = await Gallery.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    coverImage: coverImagePath || req.body.imageUrl, // Use uploaded file or provided URL
    featured: Boolean(req.body.featured)
  });

  res.status(201).json(gallery);
});

// @desc    Update gallery
// @route   PUT /api/gallery/:id
// @access  Private/Admin
const updateGallery = asyncHandler(async (req, res) => {
  let gallery = await Gallery.findById(req.params.id);
  
  if (!gallery) {
    res.status(404);
    throw new Error('Gallery not found');
  }

  // Handle image upload if new image
  if (req.file) {
    // Remove old image if it exists and is not a URL
    if (gallery.coverImage && !gallery.coverImage.startsWith('http')) {
      const oldPath = path.join(__dirname, '..', '..', gallery.coverImage);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    req.body.coverImage = req.file.path.replace(/\\/g, '/');
  }

  gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json(gallery);
});

// @desc    Delete gallery
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGallery = asyncHandler(async (req, res) => {
  const gallery = await Gallery.findById(req.params.id);
  
  if (!gallery) {
    res.status(404);
    throw new Error('Gallery not found');
  }

  // Delete cover image file if it exists and is not a URL
  if (gallery.coverImage && !gallery.coverImage.startsWith('http')) {
    const imagePath = path.join(__dirname, '..', '..', gallery.coverImage);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  // Find and delete all photos related to this gallery
  const photos = await Photo.find({ gallery: gallery._id });
  
  // Delete all photo files
  for (const photo of photos) {
    if (photo.src && !photo.src.startsWith('http')) {
      const photoPath = path.join(__dirname, '..', '..', photo.src);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    await photo.deleteOne();
  }

  await gallery.deleteOne();
  res.json({ message: 'Gallery and all photos removed' });
});

// @desc    Add photo to gallery
// @route   POST /api/gallery/:id/photos
// @access  Private/Admin
const addPhoto = asyncHandler(async (req, res) => {
  const gallery = await Gallery.findById(req.params.id);
  
  if (!gallery) {
    res.status(404);
    throw new Error('Gallery not found');
  }

  // If an image was uploaded, the path is in req.file.path
  const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null;

  if (!imagePath && !req.body.imageUrl) {
    res.status(400);
    throw new Error('Please provide an image');
  }

  const photo = await Photo.create({
    gallery: gallery._id,
    src: imagePath || req.body.imageUrl,
    caption: req.body.caption || '',
    order: req.body.order || 0
  });

  res.status(201).json(photo);
});

// @desc    Delete photo
// @route   DELETE /api/gallery/photos/:id
// @access  Private/Admin
const deletePhoto = asyncHandler(async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  
  if (!photo) {
    res.status(404);
    throw new Error('Photo not found');
  }

  // Delete image file if it exists and is not a URL
  if (photo.src && !photo.src.startsWith('http')) {
    const imagePath = path.join(__dirname, '..', '..', photo.src);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await photo.deleteOne();
  res.json({ message: 'Photo removed' });
});

module.exports = {
  getGalleries,
  getFeaturedGalleries,
  getGalleriesByCategory,
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery,
  addPhoto,
  deletePhoto
};