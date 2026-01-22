const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  roomNumber: { type: Number, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['Plumbing', 'Electrical', 'Cleaning', 'Furniture', 'Other'] 
  },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Resolved'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);