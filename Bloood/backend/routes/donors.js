const express = require('express');
const { 
  searchDonors, 
  getDonor, 
  updateDonorProfile, 
  checkEligibility,
  getDonorStats 
} = require('../controllers/donorController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/search', protect, searchDonors);
router.get('/:id', protect, getDonor);
router.put('/update', protect, updateDonorProfile);
router.get('/:id/eligibility', protect, checkEligibility);
router.get('/:id/stats', protect, getDonorStats);

module.exports = router;
