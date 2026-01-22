const MealStop = require('../models/MealStop');
const User = require('../models/User');
const Hostel = require('../models/Hostel');

// @desc    Stop meals for specific dates
// @route   POST /api/meals/stop
exports.stopMeal = async (req, res) => {
  const { studentId, fromDate, toDate, mealsToStop } = req.body;

  try {
    const student = await User.findById(studentId).populate('hostelId');
    if (!student) return res.status(404).json({ message: "Student not found" });

    const prices = student.hostelId.messPrices;
    
    // Calculate Deduction
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    let dailyDeduction = 0;
    if (mealsToStop.breakfast) dailyDeduction += prices.breakfast;
    if (mealsToStop.lunch) dailyDeduction += prices.lunch;
    if (mealsToStop.dinner) dailyDeduction += prices.dinner;

    const totalDeduction = dailyDeduction * days;

    const newStop = new MealStop({
      studentId,
      fromDate,
      toDate,
      mealsToStop,
      totalDeduction
    });

    await newStop.save();
    res.status(201).json({ message: "Meal stop registered", totalDeduction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Calculate Monthly Bill
// @route   GET /api/meals/bill/:studentId
exports.calculateBill = async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId).populate('hostelId');
    const hostel = student.hostelId;
    
    const dailyRate = hostel.messPrices.breakfast + hostel.messPrices.lunch + hostel.messPrices.dinner;
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    
    const grossBill = daysInMonth * dailyRate;

    // Sum all deductions for the current month
    const stops = await MealStop.find({ studentId: req.params.studentId });
    const totalDeduction = stops.reduce((acc, curr) => acc + curr.totalDeduction, 0);

    res.json({
      month: new Date().toLocaleString('default', { month: 'long' }),
      grossBill,
      totalDeduction,
      netBill: grossBill - totalDeduction
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Admin stats for today's mess
// @route   GET /api/meals/admin-stats/:hostelId
exports.getAdminMessStats = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.hostelId);
    const today = new Date().setHours(0, 0, 0, 0);

    // Find all active meal stops for today
    const activeStops = await MealStop.find({
      fromDate: { $lte: new Date() },
      toDate: { $gte: new Date() }
    }).populate('studentId');

    // Calculate stopped plates per meal
    let stoppedBreakfast = 0, stoppedLunch = 0, stoppedDinner = 0;
    activeStops.forEach(stop => {
      if (stop.mealsToStop.breakfast) stoppedBreakfast++;
      if (stop.mealsToStop.lunch) stoppedLunch++;
      if (stop.mealsToStop.dinner) stoppedDinner++;
    });
    
    res.json({
      usualPlates: hostel.usualPlatesCount,
      messPrices: hostel.messPrices,
      stoppedToday: { breakfast: stoppedBreakfast, lunch: stoppedLunch, dinner: stoppedDinner },
      finalPlatesNeeded: {
        breakfast: hostel.usualPlatesCount.breakfast - stoppedBreakfast,
        lunch: hostel.usualPlatesCount.lunch - stoppedLunch,
        dinner: hostel.usualPlatesCount.dinner - stoppedDinner
      },
      studentsOff: activeStops.map(s => ({ name: s.studentId.name, room: s.studentId.roomNumber }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update Hostel Mess Settings
// @route   PUT /api/meals/update-settings/:hostelId
exports.updateHostelSettings = async (req, res) => {
  const { messPrices, usualPlatesCount } = req.body;

  try {
    const hostel = await Hostel.findById(req.params.hostelId);
    if (!hostel) return res.status(404).json({ message: "Hostel not found" });

    hostel.messPrices = messPrices;
    hostel.usualPlatesCount = usualPlatesCount;
    await hostel.save();

    res.json({ message: "Hostel settings updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Download Monthly Bills CSV
// @route   GET /api/meals/download-bills/:hostelId
exports.downloadBillsCSV = async (req, res) => {
  try {
    const students = await User.find({ hostelId: req.params.hostelId, role: 'Student' }).populate('hostelId');
    
    let csv = 'Name,Room Number,Gross Bill,Deductions,Net Bill\n';
    
    for (const student of students) {
      const hostel = student.hostelId;
      const dailyRate = hostel.messPrices.breakfast + hostel.messPrices.lunch + hostel.messPrices.dinner;
      const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      const grossBill = daysInMonth * dailyRate;

      const stops = await MealStop.find({ studentId: student._id });
      const totalDeduction = stops.reduce((acc, curr) => acc + curr.totalDeduction, 0);
      const netBill = grossBill - totalDeduction;

      csv += `${student.name},${student.roomNumber},${grossBill},${totalDeduction},${netBill}\n`;
    }

    res.header('Content-Type', 'text/csv');
    res.attachment('monthly-bills.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};