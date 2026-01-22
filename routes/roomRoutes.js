const express = require('express');
const router = express.Router();
const { resetSession, generateRooms, runAllocationEngine } = require('../controllers/roomController');

router.post('/reset', resetSession);
router.post('/generate', generateRooms);
router.post('/allocate', runAllocationEngine);

module.exports = router;