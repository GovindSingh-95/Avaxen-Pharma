const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genericName: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: [
      'Pain Relief', 'Allergy', 'Supplements', 'Digestive Health',
      'Antibiotics', 'Cold & Flu', 'Vitamins', 'Skin Care',
      'Baby Care', 'Diabetes', 'Heart Health', 'Mental Health'
    ]
  },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 0 },
  image: { type: String, required: true },
  prescriptionRequired: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 100 },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  activeIngredient: { type: String, required: true },
  strength: { type: String, required: true },
  form: { 
    type: String, 
    enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops', 'Inhaler'],
    required: true 
  },
  uses: [{ type: String }],
  sideEffects: [{ type: String }],
  precautions: [{ type: String }],
  dosage: { type: String, required: true },
  
  // SEO and search
  tags: [{ type: String }],
  searchKeywords: [{ type: String }],
  
  // Admin fields
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discount percentage
medicineSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Indexes for better search performance
medicineSchema.index({ name: 'text', genericName: 'text', description: 'text' });
medicineSchema.index({ category: 1 });
medicineSchema.index({ price: 1 });
medicineSchema.index({ rating: -1 });
medicineSchema.index({ isFeatured: -1 });

module.exports = mongoose.model('Medicine', medicineSchema);
