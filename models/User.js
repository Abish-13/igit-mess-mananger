const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true, unique: true }, // e.g., Roll Number
  role: { 
    type: String, 
    enum: ['Student', 'Admin'], 
    default: 'Student' 
  },
  hostelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hostel' 
  },
  roomNumber: { type: Number }, // Numerical only as requested
  password: { type: String, required: true },
  cgpa: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);