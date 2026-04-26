const express = require('express');
const { 
  getBloodBanks, 
  getBloodBank, 
  createBloodBank, 
  updateBloodBank,
  updateAvailability,
  searchByLocation 
} = require('../controllers/bloodBankController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getBloodBanks);
router.get('/search/location', searchByLocation);
router.get('/:id', getBloodBank);
router.post('/', protect, authorize('admin'), createBloodBank);
router.put('/:id', protect, authorize('admin'), updateBloodBank);
router.patch('/:id/availability', protect, authorize('admin'), updateAvailability);

module.exports = router;
