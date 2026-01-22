const Report = require('../models/Report');
const User = require('../models/User');

// @desc    Student: Submit a maintenance request
// @route   POST /api/reports/submit
exports.submitReport = async (req, res) => {
  const { type, message } = req.body;

  try {
    const student = await User.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const newReport = new Report({
      studentId: req.user.id,
      roomNumber: student.roomNumber || 0, // Fallback if not allocated
      type,
      message,
      status: 'Pending'
    });

    await newReport.save();
    res.status(201).json({ message: "Report submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Admin: Get all reports with student details
// @route   GET /api/reports/all
exports.getAdminReports = async (req, res) => {
  try {
    console.log('Getting reports for admin:', req.user.id);
    
    // Get admin's hostel ID from database
    const admin = await User.findById(req.user.id).populate('hostelId');
    console.log('Admin found:', admin);
    
    if (!admin || !admin.hostelId) {
      console.log('Admin or hostel not found');
      return res.status(400).json({ message: "Admin hostel not found" });
    }

    console.log('Admin hostel ID:', admin.hostelId._id);

    const reports = await Report.find()
      .populate('studentId', 'name roomNumber hostelId')
      .sort({ createdAt: -1 });

    console.log('All reports found:', reports.length);

    // Filter reports to only include those from students in the same hostel
    const filteredReports = reports.filter(report => 
      report.studentId && report.studentId.hostelId && 
      report.studentId.hostelId.toString() === admin.hostelId._id.toString()
    );

    console.log('Filtered reports:', filteredReports.length);

    res.json(filteredReports);
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Admin: Update status to Resolved
// @route   PATCH /api/reports/resolve/:id
exports.updateReportStatus = async (req, res) => {
  try {
    // Get admin's hostel ID
    const admin = await User.findById(req.user.id).populate('hostelId');
    if (!admin || !admin.hostelId) {
      return res.status(400).json({ message: "Admin hostel not found" });
    }

    // Find the report and check if it belongs to a student in the same hostel
    const report = await Report.findById(req.params.id).populate('studentId', 'hostelId');
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (!report.studentId || report.studentId.hostelId.toString() !== admin.hostelId._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id, 
      { status: 'Resolved' },
      { new: true }
    ).populate('studentId', 'name roomNumber');

    res.json({ message: "Issue marked as resolved", report: updatedReport });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};