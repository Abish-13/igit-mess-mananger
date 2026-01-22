const Notice = require('../models/Notice');

// @desc    Admin: Post a new notice
// @route   POST /api/notices/post
exports.postNotice = async (req, res) => {
  const { title, content } = req.body;
  try {
    const newNotice = new Notice({ title, content });
    await newNotice.save();
    res.status(201).json({ message: "Notice posted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Public: Get all notices
// @route   GET /api/notices/all
exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ datePosted: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};