const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  // Filter by type if provided
  const filter = {};
  if (req.query.type) {
    filter.type = req.query.type;
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true }).sort({ createdAt: -1 });
  res.json(products);
});

// @desc    Get single product
// @route   GET /api/products/:slug
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  // If an image was uploaded, the path is in req.file.path
  const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null;

  // Handle printSizes array
  let printSizes = [];
  if (req.body.printSizes) {
    if (typeof req.body.printSizes === 'string') {
      printSizes = req.body.printSizes.split(',').map(size => size.trim());
    } else if (Array.isArray(req.body.printSizes)) {
      printSizes = req.body.printSizes;
    }
  }

  const product = await Product.create({
    name: req.body.name,
    type: req.body.type,
    description: req.body.description,
    price: req.body.price,
    image: imagePath || req.body.imageUrl, // Use uploaded file or provided URL
    featured: Boolean(req.body.featured),
    inStock: req.body.inStock !== false,
    downloadLink: req.body.downloadLink,
    printSizes: printSizes,
  });

  res.status(201).json(product);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Handle image upload if new image
  if (req.file) {
    // Remove old image if it exists and is not a URL
    if (product.image && !product.image.startsWith('http')) {
      const oldPath = path.join(__dirname, '..', '..', product.image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    req.body.image = req.file.path.replace(/\\/g, '/');
  }

  // Handle printSizes array
  if (req.body.printSizes) {
    if (typeof req.body.printSizes === 'string') {
      req.body.printSizes = req.body.printSizes.split(',').map(size => size.trim());
    }
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json(product);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Delete image file if it exists and is not a URL
  if (product.image && !product.image.startsWith('http')) {
    const imagePath = path.join(__dirname, '..', '..', product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};