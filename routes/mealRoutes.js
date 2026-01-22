const express = require('express');
const router = express.Router();
const { stopMeal, calculateBill, getAdminMessStats, updateHostelSettings, downloadBillsCSV } = require('../controllers/mealController');

router.post('/stop', stopMeal);
router.get('/bill/:studentId', calculateBill);
router.get('/admin-stats/:hostelId', getAdminMessStats);
router.put('/update-settings/:hostelId', updateHostelSettings);
router.get('/download-bills/:hostelId', downloadBillsCSV);

module.exports = router;