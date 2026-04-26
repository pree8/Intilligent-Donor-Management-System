const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Donor is required']
    },
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: [true, 'Blood type is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      default: 450, // Standard donation amount in ml
      min: [200, 'Quantity must be at least 200ml']
    },
    location: {
      type: String,
      required: [true, 'Donation location is required']
    },
    bloodBank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodBank',
      default: null
    },
    donationDate: {
      type: Date,
      required: [true, 'Donation date is required'],
      default: Date.now
    },
    nextEligibleDate: {
      type: Date,
      default: function() {
        const nextDate = new Date(this.donationDate);
        nextDate.setMonth(nextDate.getMonth() + 3); // 3 months cooldown
        return nextDate;
      }
    },
    status: {
      type: String,
      enum: ['completed', 'cancelled', 'pending'],
      default: 'completed'
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    }
  },
  { timestamps: true }
);

// Update donor's last donation date and canDonate status
donationSchema.post('save', async function() {
  const User = mongoose.model('User');
  
  const donor = await User.findById(this.donor);
  if (donor) {
    donor.lastDonationDate = this.donationDate;
    donor.canDonate = false;
    await donor.save();
  }
});

module.exports = mongoose.model('Donation', donationSchema);
