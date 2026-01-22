const Application = require('../models/Application');
const User = require('../models/User');

// @desc    Apply for room allocation
// @route   POST /api/applications/apply
exports.applyForRoom = async (req, res) => {
  const { studentId, cgpa } = req.body;

  try {
    // Check if student already applied
    const existingApp = await Application.findOne({ studentId });
    if (existingApp) return res.status(400).json({ message: 'Already applied' });

    const newApplication = new Application({
      studentId,
      cgpa
    });

    await newApplication.save();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};