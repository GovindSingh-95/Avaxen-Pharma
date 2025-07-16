const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    url: { type: String, required: true },
    cloudinaryId: String
  }],
  patientName: String,
  doctorName: String,
  hospitalName: String,
  notes: String,
  
  // Status
  status: {
    type: String,
    enum: ['Uploaded', 'Under Review', 'Verified', 'Rejected'],
    default: 'Uploaded'
  },
  
  // Pharmacist review
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  pharmacistNotes: String,
  
  // Detected medicines (AI analysis)
  detectedMedicines: [{
    name: String,
    confidence: Number,
    dosage: String,
    duration: String
  }],
  
  // Associated order
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
