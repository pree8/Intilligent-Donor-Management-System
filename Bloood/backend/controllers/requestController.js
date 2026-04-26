const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');
const Notification = require('../models/Notification');

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

// @desc      Create blood request
// @route     POST /api/requests
// @access    Private
exports.createRequest = async (req, res) => {
  try {
    const { bloodType, quantity, location, latitude, longitude, requiredDate, reason, description, hospital, doctorName } = req.body;

    if (!bloodType || !quantity || !location || !requiredDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields'
      });
    }

    const request = await BloodRequest.create({
      requester: req.user.id,
      bloodType,
      quantity,
      location,
      latitude: latitude || null,
      longitude: longitude || null,
      requiredDate,
      reason,
      description,
      hospital,
      doctorName
    });

    // Find and notify compatible donors
    const compatibleBloodTypes = bloodCompatibility[bloodType] || [bloodType];
    const donors = await User.find({
      bloodType: { $in: compatibleBloodTypes },
      isDonor: true,
      canDonate: true,
      isActive: true
    });

    // Create notifications for compatible donors
    for (const donor of donors) {
      await Notification.create({
        recipient: donor._id,
        type: 'blood_request',
        title: 'Blood Request Match',
        message: `Blood ${bloodType} needed in ${location}`,
        relatedEntity: {
          entityType: 'BloodRequest',
          entityId: request._id
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Blood request created successfully',
      request
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc      Get all blood requests
// @route     GET /api/requests
// @access    Private
exports.getRequests = async (req, res) => {
  try {
    const { status = 'pending', limit = 20, page = 1 } = req.query;

    let query = { status };

    const skip = (page - 1) * limit;
    const requests = await BloodRequest.find(query)
      .populate('requester', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BloodRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      pages: Math.ceil(total / limit),
      requests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc      Get single blood request
// @route     GET /api/requests/:id
// @access    Private
exports.getRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate('requester', 'firstName lastName email phone')
      .populate('matches.donor', 'firstName lastName email phone bloodType');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }

    res.status(200).json({
      success: true,
      request
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc      Update blood request status
// @route     PUT /api/requests/:id
// @access    Private
exports.updateRequest = async (req, res) => {
  try {
    const { status } = req.body;

    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }

    // Check authorization
    if (request.requester.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this request' });
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Blood request updated successfully',
      request
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc      Search nearby requests for donor
// @route     GET /api/requests/nearby
// @access    Private
exports.getNearbyRequests = async (req, res) => {
  try {
    const { latitude, longitude, distance = 10 } = req.query;
    const donor = await User.findById(req.user.id);

    if (!donor) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find requests matching donor's blood type
    const compatibleRequests = Object.keys(bloodCompatibility).filter(
      key => bloodCompatibility[key].includes(donor.bloodType)
    ).map(key => key);

    const requests = await BloodRequest.find({
      bloodType: { $in: compatibleRequests },
      status: 'pending'
    }).populate('requester', 'firstName lastName email phone');

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
