const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  type: {
    type: String,
    required: [true, 'Please specify product type'],
    enum: ['preset', 'print'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price must be positive'],
  },
  image: {
    type: String,
    required: [true, 'Please provide a product image'],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  downloadLink: {
    type: String,
    // Only required for presets
  },
  printSizes: {
    type: [String],
    // Only for prints
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create slug from name - improved slug generation
ProductSchema.pre('save', function(next) {
  // Check if name exists and is not empty
  if (this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  } else {
    // Generate a random slug if name is not available
    this.slug = 'product-' + new Date().getTime();
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema);