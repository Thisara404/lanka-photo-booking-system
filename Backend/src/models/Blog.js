const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  slug: {
    type: String,
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
  },
  excerpt: {
    type: String,
    required: [true, 'Please provide an excerpt'],
    maxlength: [250, 'Excerpt cannot be more than 250 characters'],
  },
  category: {
    type: String,
    default: 'uncategorized',
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL or upload an image'],
  },
  author: {
    type: String,
    default: 'Chamodya Kodagoda',
  },
  readTime: {
    type: String,
    default: '5 min read',
  },
  published: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create slug from title before saving
BlogSchema.pre('save', function(next) {
  if (this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-')
      + '-' + Date.now().toString().slice(-4);
  } else {
    this.slug = 'blog-' + new Date().getTime();
  }
  next();
});

// Update slug when updating the document (findByIdAndUpdate)
BlogSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.title) {
    update.slug = update.title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-')
      + '-' + Date.now().toString().slice(-4);
  }
  next();
});

module.exports = mongoose.model('Blog', BlogSchema);