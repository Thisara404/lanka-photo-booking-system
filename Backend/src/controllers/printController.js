const Print = require('../models/Print');
const PrintPurchase = require('../models/PrintPurchase');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');

// @desc    Create a new print
// @route   POST /api/prints
// @access  Private/Admin
const createPrint = asyncHandler(async (req, res) => {
  const { name, description, price, category, printSizes, featured, inStock } = req.body;
  
  // Validate required fields
  if (!name || !description || !price || !category) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }
  
  // Handle image upload
  let imagePath = null;
  if (req.files && req.files.image && req.files.image.length > 0) {
    imagePath = `/uploads/prints/${req.files.image[0].filename}`;
  } else if (req.body.imageUrl) {
    imagePath = req.body.imageUrl;
  } else {
    res.status(400);
    throw new Error('Please provide an image');
  }
  
  // Handle high-res file upload
  let highResFilePath = null;
  if (req.files && req.files.highResFile && req.files.highResFile.length > 0) {
    highResFilePath = `/uploads/downloads/${req.files.highResFile[0].filename}`;
    console.log('High resolution file uploaded:', highResFilePath);
  }
  
  // Parse sizes from string if needed
  let parsedSizes = printSizes;
  if (typeof printSizes === 'string') {
    try {
      parsedSizes = JSON.parse(printSizes);
    } catch (error) {
      // If parsing fails, treat it as a comma-separated string
      parsedSizes = printSizes.split(',').map(size => size.trim());
    }
  }
  
  // Create the print
  const print = await Print.create({
    name,
    description,
    price: Number(price),
    category,
    image: imagePath,
    printSizes: parsedSizes,
    featured: Boolean(featured === 'true' || featured === true),
    inStock: Boolean(inStock === 'true' || inStock === true),
    highResDownloadUrl: highResFilePath,
    salesCount: 0,
    downloadCount: 0
  });
  
  res.status(201).json(print);
});

// @desc    Get all prints
// @route   GET /api/prints
// @access  Public
const getPrints = asyncHandler(async (req, res) => {
  try {
    const { category, featured } = req.query;
    
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (featured) {
      query.featured = featured === 'true';
    }
    
    // Only show in-stock items for public API
    query.inStock = true;
    
    const prints = await Print.find(query)
      .select('-highResDownloadUrl -downloadTokens')
      .sort({ featured: -1, createdAt: -1 });
      
    res.json(prints);
  } catch (error) {
    console.error(`Error getting prints: ${error.message}`);
    return res.status(500).json({
      message: "Server error processing request",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get all prints (including out of stock) for admin
// @route   GET /api/prints/admin/all
// @access  Private/Admin
const getAdminPrints = asyncHandler(async (req, res) => {
  const prints = await Print.find({})
    .select('-downloadTokens')
    .sort({ createdAt: -1 });
    
  res.json(prints);
});

// @desc    Get print by ID
// @route   GET /api/prints/:id
// @access  Public
const getPrintById = asyncHandler(async (req, res) => {
  const print = await Print.findById(req.params.id)
    .select('-highResDownloadUrl -downloadTokens');
    
  if (!print) {
    res.status(404);
    throw new Error('Print not found');
  }
  
  res.json(print);
});

// @desc    Update a print
// @route   PUT /api/prints/:id
// @access  Private/Admin
const updatePrint = asyncHandler(async (req, res) => {
  const { 
    name, 
    description, 
    price, 
    category, 
    printSizes,
    featured,
    inStock
  } = req.body;
  
  const print = await Print.findById(req.params.id);
  
  if (!print) {
    res.status(404);
    throw new Error('Print not found');
  }
  
  // Handle the uploaded image if there is one
  let imagePath = print.image;
  if (req.files && req.files.image && req.files.image.length > 0) {
    // Delete old image file if it's in our uploads directory
    if (print.image && print.image.startsWith('/uploads/')) {
      const oldImagePath = path.join(__dirname, '../..', print.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    imagePath = `/uploads/prints/${req.files.image[0].filename}`;
  } else if (req.body.imageUrl && req.body.imageUrl !== print.image) {
    imagePath = req.body.imageUrl;
  }
  
  // Handle high-res download if provided
  let highResDownloadUrl = print.highResDownloadUrl;
  if (req.files && req.files.highResFile && req.files.highResFile.length > 0) {
    // Delete old high-res file if it exists
    if (print.highResDownloadUrl && print.highResDownloadUrl.startsWith('/uploads/')) {
      const oldFilePath = path.join(__dirname, '../..', print.highResDownloadUrl);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }
    highResDownloadUrl = `/uploads/downloads/${req.files.highResFile[0].filename}`;
  }
  
  const parsedSizes = typeof printSizes === 'string' 
    ? JSON.parse(printSizes) 
    : printSizes || [];
  
  print.name = name || print.name;
  print.description = description || print.description;
  print.price = price ? parseFloat(price) : print.price;
  print.image = imagePath;
  print.category = category || print.category;
  print.printSizes = parsedSizes;
  print.featured = featured !== undefined ? featured === 'true' : print.featured;
  print.inStock = inStock !== undefined ? inStock === 'true' : print.inStock;
  print.highResDownloadUrl = highResDownloadUrl;
  
  const updatedPrint = await print.save();
  
  res.json(updatedPrint);
});

// @desc    Delete a print
// @route   DELETE /api/prints/:id
// @access  Private/Admin
const deletePrint = asyncHandler(async (req, res) => {
  const print = await Print.findById(req.params.id);
  
  if (!print) {
    res.status(404);
    throw new Error('Print not found');
  }
  
  // Delete image file if it's in our uploads directory
  if (print.image && print.image.startsWith('/uploads/')) {
    const imagePath = path.join(__dirname, '../..', print.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
  
  // Delete high-res file if it exists
  if (print.highResDownloadUrl && print.highResDownloadUrl.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, '../..', print.highResDownloadUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  
  await print.deleteOne();
  
  res.json({ message: 'Print removed' });
});

// @desc    Get user's print purchases
// @route   GET /api/prints/user/purchases
// @access  Private
const getUserPrintPurchases = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const purchases = await PrintPurchase.find({ 
    userId: userId,
    status: 'COMPLETED'
  })
  .populate('printId', 'name image price category')
  .sort({ createdAt: -1 });
  
  res.json(purchases);
});

// @desc    Download a print with valid token
// @route   GET /api/prints/download/:token
// @access  Public (with token)
const downloadPrint = asyncHandler(async (req, res) => {
  const { token } = req.params;
  
  if (!token) {
    res.status(400);
    throw new Error('Download token is required');
  }
  
  // Find the print with this download token
  const print = await Print.findOne({
    downloadTokens: {
      $elemMatch: {
        token,
        expiresAt: { $gt: new Date() } // Check that it hasn't expired
      }
    }
  });
  
  if (!print) {
    res.status(404);
    throw new Error('Invalid or expired download token');
  }
  
  // Find the token in the array
  const tokenObj = print.downloadTokens.find(t => t.token === token);
  
  if (!tokenObj) {
    res.status(404);
    throw new Error('Download token not found');
  }
  
  // Find the purchase associated with this download
  const purchase = await PrintPurchase.findOne({
    userId: tokenObj.userId,
    printId: print._id,
    downloadLink: { $regex: token }
  });
  
  // Update both purchase and print download counts
  const updatePromises = [];
  
  if (purchase) {
    purchase.downloadCount = (purchase.downloadCount || 0) + 1;
    updatePromises.push(purchase.save());
  }
  
  // Ensure print has downloadCount field initialized
  print.downloadCount = (print.downloadCount || 0) + 1;
  updatePromises.push(print.save());
  
  // Wait for both updates to complete before proceeding
  await Promise.all(updatePromises);
  
  // Log the download for debugging
  console.log(`Download tracked: Print ${print._id}, Count: ${print.downloadCount}`);
  
  // Check if the file exists
  const filePath = path.join(__dirname, '../../', print.highResDownloadUrl);
  
  if (!fs.existsSync(filePath)) {
    res.status(404);
    throw new Error('Download file not found');
  }
  
  // Send the file
  const fileName = `${print.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_high_res.jpg`;
  res.download(filePath, fileName);
});

// @desc    Get admin print statistics
// @route   GET /api/prints/admin/stats
// @access  Private/Admin
const getAdminPrintStats = asyncHandler(async (req, res) => {
  const prints = await Print.find({})
    .select('name image price category salesCount downloadCount')
    .sort({ salesCount: -1, downloadCount: -1 });
    
  res.json(prints);
});

// @desc    Get purchases for a specific print
// @route   GET /api/prints/admin/purchases/:printId
// @access  Private/Admin
const getAdminPrintPurchases = asyncHandler(async (req, res) => {
  const printId = req.params.printId;
  
  const purchases = await PrintPurchase.find({ printId })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
    
  res.json(purchases);
});

module.exports = {
  createPrint,
  getPrints,
  getAdminPrints,
  getPrintById,
  updatePrint,
  deletePrint,
  getUserPrintPurchases,
  downloadPrint,
  getAdminPrintStats,
  getAdminPrintPurchases
};