const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['weddings', 'landscapes', 'wildlife', 'portraits', 'cultural', 'graduations'],
  },
  coverImage: {
    type: String,
    required: [true, 'Please provide a cover image'],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create slug from title - improved slug generation
GallerySchema.pre('save', function(next) {
  // Check if title exists and is not empty
  if (this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  } else {
    // Generate a random slug if title is not available
    this.slug = 'gallery-' + new Date().getTime();
  }
  next();
});

module.exports = mongoose.model('Gallery', GallerySchema);