import mongoose from 'mongoose';

const TipSchema = new mongoose.Schema({
  category: { type: String, enum: ['time', 'focus', 'consistency', 'breaks', 'general'], default: 'general' },
  message: { type: String, required: true },
  minProductivityScore: { type: Number, default: 0 },
  maxProductivityScore: { type: Number, default: 100 },
}, { timestamps: true });

export default mongoose.model('Tip', TipSchema);
