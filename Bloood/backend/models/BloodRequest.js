const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Requester is required']
    },
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: [true, 'Blood type is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1 unit']
    },
    location: {
      type: String,
      required: [true, 'Location is required']
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    },
    requiredDate: {
      type: Date,
      required: [true, 'Required date is required']
    },
    reason: {
      type: String,
      enum: ['emergency', 'surgery', 'transfusion', 'test', 'other'],
      default: 'other'
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    hospital: {
      type: String,
      trim: true
    },
    doctorName: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'fulfilled', 'cancelled', 'expired'],
      default: 'pending'
    },
    matches: [{
      donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed'],
        default: 'pending'
      },
      requestedAt: {
        type: Date,
        default: Date.now
      }
    }],
    distance: {
      type: Number,
      default: null
    }
  },
  { timestamps: true }
);

// Index for location-based queries
bloodRequestSchema.index({ latitude: 1, longitude: 1 });
bloodRequestSchema.index({ status: 1, requiredDate: 1 });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
