const express = require('express');
const { 
  createRequest, 
  getRequests, 
  getRequest, 
  updateRequest,
  getNearbyRequests 
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createRequest);
router.get('/', protect, getRequests);
router.get('/nearby', protect, getNearbyRequests);
router.get('/:id', protect, getRequest);
router.put('/:id', protect, updateRequest);

module.exports = router;
