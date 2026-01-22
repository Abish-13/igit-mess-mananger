const express = require('express');
const { submitReport, getAdminReports, updateReportStatus } = require('../controllers/reportController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/submit', auth, submitReport);
router.get('/all', auth, role('Admin'), getAdminReports);
router.patch('/resolve/:id', auth, role('Admin'), updateReportStatus);

module.exports = router;