const BloodBank = require('../models/BloodBank');

// @desc      Get all blood banks
// @route     GET /api/blood-banks
// @access    Public
exports.getBloodBanks = async (req, res) => {
  try {
    const { location, search, limit = 20, page = 1, verified = true } = req.query;

    let query = { isActive: true };
    if (verified) {
      query.verificationStatus = 'verified';
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const banks = await BloodBank.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BloodBank.countDocuments(query);

    res.status(200).json({
      success: true,
      count: banks.length,
      total,
      pages: Math.ceil(total / limit),
      banks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc      Get single blood bank
// @route     GET /api/blood-banks/:id
// @access    Public
exports.getBloodBank = async (req, res) => {
  try {
    const bank = await BloodBank.findById(req.params.id);

    if (!bank) {
      return res.status(404).json({ success: false, message: 'Blood bank not found' });
    }

    res.status(200).json({
      success: true,
      bank
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc      Create blood bank
// @route     POST /api/blood-banks
// @access    Private/Admin
exports.createBloodBank = async (req, res) => {
  try {
    const { name, email, phone, address, location, latitude, longitude, operatingHours, type, contactPerson } = req.body;

    if (!name || !email || !phone || !address || !location || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    let bank = await BloodBank.findOne({ email });
    if (bank) {
      return res.status(400).json({ success: false, message: 'Blood bank already exists' });
    }

    bank = await BloodBank.create({
      name,
      email,
      phone,
      address,
      location,
      latitude: latitude || null,
      longitude: longitude || null,
      operatingHours,
      type,
      contactPerson
    });

    res.status(201).json({
      success: true,
      message: 'Blood bank created successfully',
      bank
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc      Update blood bank
// @route     PUT /api/blood-banks/:id
// @access    Private/Admin
exports.updateBloodBank = async (req, res) => {
  try {
    let bank = await BloodBank.findById(req.params.id);

    if (!bank) {
      return res.status(404).json({ success: false, message: 'Blood bank not found' });
    }

    bank = await BloodBank.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      message: 'Blood bank updated successfully',
      bank
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc      Update blood availability
// @route     PATCH /api/blood-banks/:id/availability
// @access    Private/Admin
exports.updateAvailability = async (req, res) => {
  try {
    const { bloodType, quantity } = req.body;

    if (!bloodType || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide blood type and quantity'
      });
    }

    const bank = await BloodBank.findById(req.params.id);
    if (!bank) {
      return res.status(404).json({ success: false, message: 'Blood bank not found' });
    }

    bank.availability[bloodType] = quantity;
    await bank.save();

    res.status(200).json({
      success: true,
      message: 'Blood availability updated',
      bank
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc      Search blood banks by location
// @route     GET /api/blood-banks/search/location
// @access    Public
exports.searchByLocation = async (req, res) => {
  try {
    const { latitude, longitude, distance = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    const banks = await BloodBank.find({
      isActive: true,
      verificationStatus: 'verified',
      latitude: { $ne: null },
      longitude: { $ne: null }
    });

    // Calculate distance and filter
    const nearby = banks.map(bank => ({
      ...bank.toObject(),
      distance: calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        bank.latitude,
        bank.longitude
      )
    }))
    .filter(bank => bank.distance <= parseFloat(distance))
    .sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      count: nearby.length,
      banks: nearby
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
