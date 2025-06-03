const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create necessary directories
const createDir = (dirPath) => {
  const fullPath = path.join(__dirname, '../../', dirPath);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${fullPath}`);
  }
  return fullPath;
};

// Ensure upload directories exist
createDir('uploads');
createDir('uploads/blog');
createDir('uploads/gallery');
createDir('uploads/products');
createDir('uploads/prints');
createDir('uploads/downloads');
createDir('uploads/photos');

// Configure storage for different file types
const blogStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/blog');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `blog-${uniqueSuffix}${ext}`);
  }
});

const galleryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/gallery');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `gallery-${uniqueSuffix}${ext}`);
  }
});

const photoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/photos');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `photo-${uniqueSuffix}${ext}`);
  }
});

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${ext}`);
  }
});

const printStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = file.fieldname === 'highResFile' 
      ? 'uploads/downloads' 
      : 'uploads/prints';
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname === 'highResFile'
      ? `highres-${uniqueSuffix}${ext}`
      : `print-${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

// File filter to accept only image files
const imageFileFilter = (req, file, cb) => {
  // Accept image files only
  const allowedFileTypes = /jpeg|jpg|png|gif|webp|avif/;
  const mimetype = allowedFileTypes.test(file.mimetype);
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  
  cb(new Error('Only image files are allowed!'));
};

// Configure multer upload for each type
const blogUpload = multer({ 
  storage: blogStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const galleryUpload = multer({ 
  storage: galleryStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

const photoUpload = multer({ 
  storage: photoStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

const productUpload = multer({ 
  storage: productStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const printUpload = multer({ 
  storage: printStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

module.exports = {
  blogUpload,
  galleryUpload,
  photoUpload,
  productUpload,
  printUpload
};