const express = require('express');
const multer = require('multer');
const cloudinary = require('../../utils/cloudinary');
const Medicine = require('../../models/Medicine');
const { protect, admin } = require('../../middlewares/auth');

const router = express.Router();

// Configure multer for image uploads
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

// Upload medicine image with optimization
router.post('/upload-image', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { medicineId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select an image to upload'
      });
    }

    if (!medicineId) {
      return res.status(400).json({
        success: false,
        message: 'Medicine ID is required'
      });
    }

    // Find the medicine
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    // Upload to Cloudinary with medicine-specific transformations
    const uploadOptions = {
      folder: `avaxen/medicines/${medicine.category.toLowerCase().replace(/\s+/g, '-')}`,
      public_id: `${medicine.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      transformation: [
        {
          width: 400,
          height: 400,
          crop: 'fill',
          gravity: 'center',
          quality: 'auto:best',
          format: 'webp'
        }
      ],
      resource_type: 'image'
    };

    // Convert buffer to base64 for Cloudinary
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    const result = await cloudinary.uploader.upload(base64Image, uploadOptions);

    // Update medicine with new image URL
    medicine.image = result.secure_url;
    medicine.imageCloudinaryId = result.public_id;
    await medicine.save();

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      medicine: medicine
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// Bulk upload medicine images
router.post('/bulk-upload', protect, admin, upload.array('images', 50), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select images to upload'
      });
    }

    const uploadResults = [];
    const errors = [];

    for (const file of req.files) {
      try {
        // Extract medicine name from filename (assuming format: medicine-name.jpg)
        const fileName = file.originalname.toLowerCase().replace(/\.[^/.]+$/, ""); // Remove extension
        const medicineName = fileName.replace(/[-_]/g, ' ');

        // Find medicine by name (fuzzy match)
        const medicine = await Medicine.findOne({
          $or: [
            { name: { $regex: medicineName, $options: 'i' } },
            { genericName: { $regex: medicineName, $options: 'i' } }
          ]
        });

        if (!medicine) {
          errors.push({
            filename: file.originalname,
            error: 'No matching medicine found'
          });
          continue;
        }

        // Upload to Cloudinary
        const uploadOptions = {
          folder: `avaxen/medicines/${medicine.category.toLowerCase().replace(/\s+/g, '-')}`,
          public_id: `${medicine.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
          transformation: [
            {
              width: 400,
              height: 400,
              crop: 'fill',
              gravity: 'center',
              quality: 'auto:best',
              format: 'webp'
            }
          ]
        };

        const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const result = await cloudinary.uploader.upload(base64Image, uploadOptions);

        // Update medicine
        medicine.image = result.secure_url;
        medicine.imageCloudinaryId = result.public_id;
        await medicine.save();

        uploadResults.push({
          filename: file.originalname,
          medicineName: medicine.name,
          imageUrl: result.secure_url,
          success: true
        });

      } catch (uploadError) {
        errors.push({
          filename: file.originalname,
          error: uploadError.message
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Uploaded ${uploadResults.length} images successfully`,
      uploadResults,
      errors: errors.length > 0 ? errors : undefined,
      summary: {
        total: req.files.length,
        successful: uploadResults.length,
        failed: errors.length
      }
    });

  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Bulk upload failed',
      error: error.message
    });
  }
});

// Generate medicine image from AI/template
router.post('/generate-image', protect, admin, async (req, res) => {
  try {
    const { medicineId, style = 'product' } = req.body;

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    // Generate placeholder image with medicine details
    const placeholderUrl = generatePlaceholderImage(medicine, style);

    // Update medicine
    medicine.image = placeholderUrl;
    await medicine.save();

    res.status(200).json({
      success: true,
      message: 'Placeholder image generated',
      imageUrl: placeholderUrl,
      medicine
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate image',
      error: error.message
    });
  }
});

// Helper function to generate placeholder images
function generatePlaceholderImage(medicine, style) {
  const baseUrl = 'https://via.placeholder.com/400x400';
  const color = getColorByCategory(medicine.category);
  const text = encodeURIComponent(medicine.name);
  
  switch (style) {
    case 'product':
      return `${baseUrl}/${color}/ffffff?text=${text}`;
    case 'minimal':
      return `${baseUrl}/f8f9fa/6c757d?text=${medicine.form}`;
    case 'branded':
      return `${baseUrl}/${color}/ffffff?text=${medicine.manufacturer}`;
    default:
      return `${baseUrl}/e9ecef/495057?text=${text}`;
  }
}

function getColorByCategory(category) {
  const colors = {
    'Pain Relief': '3b82f6',
    'Antibiotics': '10b981',
    'Supplements': 'f59e0b',
    'Digestive Health': '8b5cf6',
    'Allergy': 'ef4444',
    'default': '6b7280'
  };
  return colors[category] || colors.default;
}

// Delete medicine image
router.delete('/delete-image/:medicineId', protect, admin, async (req, res) => {
  try {
    const { medicineId } = req.params;
    
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    // Delete from Cloudinary if exists
    if (medicine.imageCloudinaryId) {
      await cloudinary.uploader.destroy(medicine.imageCloudinaryId);
    }

    // Clear image from medicine
    medicine.image = '';
    medicine.imageCloudinaryId = undefined;
    await medicine.save();

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      medicine
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

module.exports = router;
