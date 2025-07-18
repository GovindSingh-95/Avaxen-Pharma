const mongoose = require('mongoose');

const deliveryAgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  vehicle: {
    type: { type: String, required: true, enum: ['Bike', 'Car', 'Scooter', 'Bicycle'] },
    number: { type: String, required: true },
    model: { type: String }
  },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
    address: { type: String }
  },
  status: { 
    type: String, 
    enum: ['available', 'busy', 'offline'], 
    default: 'available' 
  },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  totalDeliveries: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  joiningDate: { type: Date, default: Date.now },
  documents: {
    drivingLicense: { type: String },
    vehicleRegistration: { type: String },
    aadharCard: { type: String }
  },
  workingHours: {
    start: { type: String, default: '09:00' },
    end: { type: String, default: '21:00' }
  },
  currentOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true });

// Index for location-based queries
deliveryAgentSchema.index({ "location.latitude": 1, "location.longitude": 1 });

module.exports = mongoose.model('DeliveryAgent', deliveryAgentSchema);
