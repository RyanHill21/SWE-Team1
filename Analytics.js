import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  totalStudyMinutes: { type: Number, default: 0 },
  completionRate: { type: Number, min: 0, max: 1, default: 0 }, 
  productivityScore: { type: Number, min: 0, max: 100, default: 0 }, 
  byDay: [{
    date: { type: Date },
    studyMinutes: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Analytics', AnalyticsSchema);
