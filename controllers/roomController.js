const User = require('../models/User');
const Application = require('../models/Application');
const Hostel = require('../models/Hostel');

// @desc    Admin: Reset all allocations for a new semester
// @route   POST /api/rooms/reset
exports.resetSession = async (req, res) => {
  try {
    const { hostelId } = req.body;
    // 1. Reset all student rooms to 0 (Not Allocated)
    await User.updateMany({ hostelId, role: 'Student' }, { roomNumber: 0 });
    // 2. Clear previous applications
    await Application.deleteMany({}); 
    
    res.json({ message: "Session reset successful. All rooms are now vacant." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Admin: Generate available slots based on hostel capacity
// @route   POST /api/rooms/generate
exports.generateRooms = async (req, res) => {
  const { hostelId, totalRooms, bedPerRoom } = req.body;
  try {
    await Hostel.findByIdAndUpdate(hostelId, { totalRooms, bedPerRoom });
    res.json({ message: `System configured for ${totalRooms} rooms with ${bedPerRoom} beds each.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    The Core Allocation Engine (Priority based on CGPA)
// @route   POST /api/rooms/allocate
exports.runAllocationEngine = async (req, res) => {
  const { hostelId } = req.body;

  try {
    const hostel = await Hostel.findById(hostelId);
    // 1. Fetch all 'Pending' applications sorted by CGPA (Descending)
    const applicants = await Application.find({ applicationStatus: 'Pending' })
      .sort({ cgpa: -1 })
      .populate('studentId');

    let currentRoom = 1;
    let currentBedInRoom = 1;
    const totalCapacity = hostel.totalRooms * hostel.bedPerRoom;

    const allocationResults = [];

    for (let i = 0; i < applicants.length; i++) {
      if (i < totalCapacity) {
        // Assign Room
        const student = applicants[i].studentId;
        
        await User.findByIdAndUpdate(student._id, { roomNumber: currentRoom });
        await Application.findByIdAndUpdate(applicants[i]._id, { applicationStatus: 'Approved' });

        allocationResults.push({ name: student.name, room: currentRoom });

        // Logic to move to next room after beds are full
        currentBedInRoom++;
        if (currentBedInRoom > hostel.bedPerRoom) {
          currentBedInRoom = 1;
          currentRoom++;
        }
      } else {
        // Capacity reached: Mark as Rejected/Waitlisted
        await Application.findByIdAndUpdate(applicants[i]._id, { applicationStatus: 'Rejected' });
      }
    }

    res.json({ message: "Allocation Complete", allocatedCount: allocationResults.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};