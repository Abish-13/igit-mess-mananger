const express = require('express');
const { postNotice, getNotices } = require('../controllers/noticeController');

const router = express.Router();

router.post('/post', postNotice);
router.get('/all', getNotices);

module.exports = router;