const mongoose = require('mongoose');

const medicineScanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  image: {
    url: { type: String, required: true },
    cloudinaryId: String
  },
  
  // AI Detection Results
  detectedMedicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine'
  },
  detectedName: String,
  confidence: { type: Number, min: 0, max: 1 },
  
  // Alternative suggestions
  alternatives: [{
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine'
    },
    confidence: Number,
    name: String
  }],
  
  // OCR Text extraction
  extractedText: String,
  
  // Processing status
  status: {
    type: String,
    enum: ['Processing', 'Completed', 'Failed'],
    default: 'Processing'
  },
  
  // Analytics
  ipAddress: String,
  userAgent: String
}, { timestamps: true });

module.exports = mongoose.model('MedicineScan', medicineScanSchema);
