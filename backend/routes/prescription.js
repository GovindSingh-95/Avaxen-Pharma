const express = require('express');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const { protect, pharmacist } = require('../middlewares/auth');
const Prescription = require('../models/Prescription');

const router = express.Router();

// Simple multer configuration for now
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for prescriptions
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Please upload only image or PDF files'), false);
    }
  }
});

// Upload prescription
const uploadPrescription = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one prescription image'
      });
    }

    const { patientName, doctorName, hospitalName, notes } = req.body;

    // For now, we'll store a placeholder URL (in production, upload to Cloudinary here)
    const images = req.files.map((file, index) => ({
      url: `/uploads/prescription_${Date.now()}_${index}.${file.originalname.split('.').pop()}`,
      cloudinaryId: `temp_${Date.now()}_${index}`
    }));

    const prescription = new Prescription({
      user: req.user.id,
      images,
      patientName,
      doctorName,
      hospitalName,
      notes,
      status: 'Uploaded'
    });

    await prescription.save();

    res.status(201).json({
      success: true,
      message: 'Prescription uploaded successfully',
      data: prescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload prescription',
      error: error.message
    });
  }
};

// Get user's prescriptions
const getUserPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ user: req.user.id })
      .populate('reviewedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: prescriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get prescriptions',
      error: error.message
    });
  }
};

// Get prescription by ID
const getPrescriptionById = async (req, res) => {
  try {
    // Prevent static routes from being treated as IDs
    if (req.params.id === 'review' || req.params.id === 'upload') {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    const prescription = await Prescription.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('reviewedBy', 'firstName lastName');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // Check authorization
    if (prescription.user._id.toString() !== req.user.id && 
        req.user.role !== 'pharmacist' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this prescription'
      });
    }

    res.status(200).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get prescription',
      error: error.message
    });
  }
};

// Pharmacist: Review prescription
const reviewPrescription = async (req, res) => {
  try {
    // Prevent static routes from being treated as IDs
    if (req.params.id === 'review' || req.params.id === 'upload') {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    const { status, pharmacistNotes, detectedMedicines } = req.body;
    
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    prescription.status = status;
    prescription.pharmacistNotes = pharmacistNotes;
    prescription.detectedMedicines = detectedMedicines;
    prescription.reviewedBy = req.user.id;
    prescription.reviewedAt = new Date();

    await prescription.save();

    res.status(200).json({
      success: true,
      message: 'Prescription reviewed successfully',
      data: prescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to review prescription',
      error: error.message
    });
  }
};

// Get all prescriptions for pharmacist review
const getPrescriptionsForReview = async (req, res) => {
  try {
    const { status = 'Uploaded' } = req.query;
    
    const prescriptions = await Prescription.find({ status })
      .populate('user', 'firstName lastName email phone')
      .sort({ createdAt: 1 }); // Oldest first

    res.status(200).json({
      success: true,
      data: prescriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get prescriptions for review',
      error: error.message
    });
  }
};

// Routes - Static routes first, then parameterized routes
router.post('/upload', protect, upload.array('images', 5), uploadPrescription);
router.get('/', protect, getUserPrescriptions);
router.get('/review', pharmacist, getPrescriptionsForReview);
router.get('/:id', protect, getPrescriptionById);
router.put('/:id/review', pharmacist, reviewPrescription);

module.exports = router;
