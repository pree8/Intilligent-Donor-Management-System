const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');

// Blood type compatibility map
const bloodCompatibility = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+']
};

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

// @desc      Search for donors
// @route     GET /api/donors/search
// @access    Private
exports.searchDonors = async (req, res) => {
  try {
    const { bloodType, location, distance = 10, latitude, longitude } = req.query;

    if (!bloodType || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide blood type and location'
      });
    }

    // Find compatible donors for requested blood type
    const compatibleBloodTypes = bloodCompatibility[bloodType] || [bloodType];

    let query = {
      bloodType: { $in: compatibleBloodTypes },
      isDonor: true,
      canDonate: true,
      isActive: true,
      verificationStatus: 'verified'
    };

    // If location search without coordinates
    if (!latitude || !longitude) {
      query.location = { $regex: location, $options: 'i' };
    }

    let donors = await User.find(query).select('-password').limit(50);

    // If coordinates provided, calculate distance and filter
    if (latitude && longitude) {
      donors = donors.map(donor => ({
        ...donor.toObject(),
        distance: donor.latitude && donor.longitude ?
          calculateDistance(parseFloat(latitude), parseFloat(longitude), donor.latitude, donor.longitude) : null
      }));

      // Filter by distance
      donors = donors.filter(donor => donor.distance !== null && donor.distance <= parseFloat(distance));

      // Sort by distance
      donors.sort((a, b) => a.distance - b.distance);
    }

    res.status(200).json({
      success: true,
      count: donors.length,
      donors
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc      Get donor profile
// @route     GET /api/donors/:id
// @access    Private
exports.getDonor = async (req, res) => {
  try {
    const donor = await User.findById(req.params.id).select('-password');

    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }

    res.status(200).json({
      success: true,
      donor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc      Update donor profile
// @route     PUT /api/donors/update
// @access    Private
exports.updateDonorProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, location, latitude, longitude } = req.body;

    const donor = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, phone, location, latitude, longitude },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      donor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc      Check donation eligibility
// @route     GET /api/donors/eligibility/:id
// @access    Private
exports.checkEligibility = async (req, res) => {
  try {
    const donor = await User.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }

    const nextEligibleDate = donor.lastDonationDate ?
      new Date(new Date(donor.lastDonationDate).setMonth(new Date(donor.lastDonationDate).getMonth() + 3)) : null;

    res.status(200).json({
      success: true,
      canDonate: donor.canDonate,
      lastDonationDate: donor.lastDonationDate,
      nextEligibleDate,
      message: donor.canDonate ? 'Eligible to donate' : 'Not eligible to donate'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc      Get donor statistics
// @route     GET /api/donors/:id/stats
// @access    Private
exports.getDonorStats = async (req, res) => {
  try {
    const donor = await User.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }

    const Donation = require('../models/Donation');
    const donations = await Donation.countDocuments({ donor: req.params.id, status: 'completed' });

    res.status(200).json({
      success: true,
      stats: {
        totalDonations: donations,
        bloodType: donor.bloodType,
        canDonate: donor.canDonate,
        lastDonationDate: donor.lastDonationDate,
        joinedDate: donor.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
