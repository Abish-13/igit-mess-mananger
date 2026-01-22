const express = require('express');
const router = express.Router();
const { applyForRoom } = require('../controllers/applicationController');

router.post('/apply', applyForRoom);

module.exports = router;