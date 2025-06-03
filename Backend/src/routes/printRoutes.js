const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const printController = require('../controllers/printController');
const { printUpload } = require('../utils/imageProcessing');

// Public routes
router.get('/', printController.getPrints);
router.get('/:id', printController.getPrintById);
router.get('/download/:token', printController.downloadPrint);

// Admin routes
router.use('/admin', protect, admin);
router.get('/admin/all', printController.getAdminPrints);
router.get('/admin/stats', printController.getAdminPrintStats);
router.get('/admin/purchases/:printId', printController.getAdminPrintPurchases);

// Protected admin routes with file upload
router.post('/', 
  protect, 
  admin, 
  printUpload.fields([
    { name: 'image', maxCount: 1 }, 
    { name: 'highResFile', maxCount: 1 }
  ]), 
  printController.createPrint
);

router.put('/:id', 
  protect, 
  admin, 
  printUpload.fields([
    { name: 'image', maxCount: 1 }, 
    { name: 'highResFile', maxCount: 1 }
  ]), 
  printController.updatePrint
);

router.delete('/:id', protect, admin, printController.deletePrint);

module.exports = router;