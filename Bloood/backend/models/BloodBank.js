const mongoose = require('mongoose');

const bloodBankSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide blood bank name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide valid email']
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      match: [/^\+?[0-9]{10,15}$/, 'Please provide valid phone number']
    },
    address: {
      type: String,
      required: [true, 'Please provide address']
    },
    location: {
      type: String,
      required: [true, 'Please provide location/city']
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    },
    operatingHours: {
      type: String,
      default: '9:00 AM - 5:00 PM'
    },
    type: {
      type: String,
      enum: ['Hospital', 'Blood Center', 'Blood Bank', 'Non-profit'],
      required: [true, 'Please specify blood bank type']
    },
    availability: {
      'A+': { type: Number, default: 0 },
      'A-': { type: Number, default: 0 },
      'B+': { type: Number, default: 0 },
      'B-': { type: Number, default: 0 },
      'AB+': { type: Number, default: 0 },
      'AB-': { type: Number, default: 0 },
      'O+': { type: Number, default: 0 },
      'O-': { type: Number, default: 0 }
    },
    contactPerson: {
      type: String,
      trim: true
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Add geospatial index for location-based queries
bloodBankSchema.index({ latitude: 1, longitude: 1 });
bloodBankSchema.index({ location: 'text', name: 'text' });

module.exports = mongoose.model('BloodBank', bloodBankSchema);
