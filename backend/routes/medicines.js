const express = require('express');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const { protect } = require('../middlewares/auth');
const {
  getMedicines,
  getMedicineById,
  getFeaturedMedicines,
  getCategories,
  searchMedicines,
  scanMedicine,
  getScanResult
} = require('../controllers/medicineController');

const router = express.Router();

// Simple multer configuration for now (we'll fix Cloudinary later)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload only image files'), false);
    }
  }
});

// Public routes
router.get('/', getMedicines);
router.get('/featured', getFeaturedMedicines);
router.get('/categories', getCategories);
router.get('/search', searchMedicines);

// Medicine scanner routes (before parameterized routes)
router.post('/scan', upload.single('image'), scanMedicine);
router.get('/scan/:scanId/result', getScanResult);

// Parameterized routes (must come last)
router.get('/:id', getMedicineById);

module.exports = router;
