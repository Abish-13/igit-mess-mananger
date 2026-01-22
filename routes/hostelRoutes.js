const express = require('express');
const { getHostels, createHostel, updateHostel, deleteHostel } = require('../controllers/hostelController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', auth, getHostels);
router.post('/', auth, role('admin'), createHostel);
router.put('/:id', auth, role('admin'), updateHostel);
router.delete('/:id', auth, role('admin'), deleteHostel);

module.exports = router;