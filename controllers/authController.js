const User = require('../models/User');
const Hostel = require('../models/Hostel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper: Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register Admin & Create Hostel
// @route   POST /api/auth/register-admin
exports.registerAdmin = async (req, res) => {
  const { name, userId, password, hostelName, totalRooms, bedPerRoom, messPrices, usualPlatesCount } = req.body;

  try {
    // 1. Check if Admin already exists
    let user = await User.findOne({ userId });
    if (user) return res.status(400).json({ message: 'User ID already exists' });

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create Admin User
    const newAdmin = new User({
      name,
      userId,
      password: hashedPassword,
      role: 'Admin',
    });
    const savedAdmin = await newAdmin.save();

    // 4. Create Hostel Linked to Admin
    const newHostel = new Hostel({
      hostelName,
      adminId: savedAdmin._id,
      totalRooms,
      bedPerRoom,
      messPrices, // Expecting object { breakfast: 20, lunch: 40, dinner: 40 }
      usualPlatesCount // Expecting object { breakfast: 100, lunch: 100, dinner: 100 }
    });
    const savedHostel = await newHostel.save();

    // 5. Link Hostel back to Admin
    savedAdmin.hostelId = savedHostel._id;
    await savedAdmin.save();

    res.status(201).json({
      message: 'Hostel and Admin created successfully',
      token: generateToken(savedAdmin._id, savedAdmin.role)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Register Student
// @route   POST /api/auth/register-student
exports.registerStudent = async (req, res) => {
  const { name, userId, password, hostelId, roomNumber } = req.body;

  try {
    // 1. Validation
    const existingUser = await User.findOne({ userId });
    if (existingUser) return res.status(400).json({ message: 'User ID already exists' });

    // Numeric Room Check (Backend safeguard)
    if (isNaN(roomNumber)) return res.status(400).json({ message: 'Room number must be numerical' });

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create Student
    const newStudent = new User({
      name,
      userId,
      password: hashedPassword,
      role: 'Student',
      hostelId, // Selected from dropdown
      roomNumber
    });

    await newStudent.save();

    res.status(201).json({ 
      message: 'Student registered successfully',
      token: generateToken(newStudent._id, newStudent.role)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Login User
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      message: 'Login successful',
      _id: user._id,
      name: user.name,
      role: user.role,
      hostelId: user.hostelId,
      token: generateToken(user._id, user.role)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get All Hostels (For Dropdown)
// @route   GET /api/auth/hostels
exports.getHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find({}, 'hostelName _id'); // Only fetch name and ID
    res.json(hostels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get User by ID
// @route   GET /api/auth/user/:id
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Admin: Delete a student
// @route   DELETE /api/auth/user/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'Student') return res.status(400).json({ message: 'Only students can be deleted' });
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Admin: Get all students in hostel
// @route   GET /api/auth/students/:hostelId
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ hostelId: req.params.hostelId, role: 'Student' }).select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};