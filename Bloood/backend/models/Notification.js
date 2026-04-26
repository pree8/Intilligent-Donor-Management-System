const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required']
    },
    type: {
      type: String,
      enum: ['blood_request', 'donor_match', 'donation_reminder', 'system', 'message'],
      required: [true, 'Notification type is required']
    },
    title: {
      type: String,
      required: [true, 'Title is required']
    },
    message: {
      type: String,
      required: [true, 'Message is required']
    },
    relatedEntity: {
      entityType: {
        type: String,
        enum: ['BloodRequest', 'User', 'Donation', 'BloodBank'],
        default: null
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      }
    },
    isRead: {
      type: Boolean,
      default: false
    },
    actionUrl: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

// Index for faster queries
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
