const mongoose = require('mongoose');

const HostelSchema = new mongoose.Schema({
  hostelName: { type: String, required: true },
  adminId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  totalRooms: { type: Number, required: true },
  bedPerRoom: { type: Number, required: true },
  messPrices: {
    breakfast: { type: Number, required: true },
    lunch: { type: Number, required: true },
    dinner: { type: Number, required: true }
  },
  usualPlatesCount: {
    breakfast: { type: Number, default: 0 },
    lunch: { type: Number, default: 0 },
    dinner: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('Hostel', HostelSchema);