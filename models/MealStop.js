const mongoose = require('mongoose');

const MealStopSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  mealsToStop: {
    breakfast: { type: Boolean, default: false },
    lunch: { type: Boolean, default: false },
    dinner: { type: Boolean, default: false }
  },
  totalDeduction: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('MealStop', MealStopSchema);