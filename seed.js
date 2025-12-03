import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Analytics from '../models/Analytics.js';
import Tip from '../models/Tip.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartstudy';

const demoUserId = new mongoose.Types.ObjectId('656c0f7a3b1b3a2f9a5e1111'); 

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected for seeding');

  await Analytics.deleteMany({ userId: demoUserId });
  await Tip.deleteMany({});

  const today = new Date();
  const byDay = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (13 - i));
    return {
      date: d,
      studyMinutes: Math.floor(20 + Math.random() * 80),
      completedTasks: Math.floor(1 + Math.random() * 5)
    };
  });

  const totalStudyMinutes = byDay.reduce((s, r) => s + r.studyMinutes, 0);
  const completionRate = Math.min(1, byDay.reduce((s, r) => s + r.completedTasks, 0) / 50);
  const productivityScore = Math.round(40 + Math.random() * 45); // 40..85

  await Analytics.create({
    userId: demoUserId,
    totalStudyMinutes,
    completionRate,
    productivityScore,
    byDay
  });

  await Tip.insertMany([
    { category: 'time', message: 'Block 25-minute focus sprints (Pomodoro) and protect them.', minProductivityScore: 0, maxProductivityScore: 60 },
    { category: 'focus', message: 'Silence notifications and use a site blocker during study windows.', minProductivityScore: 0, maxProductivityScore: 70 },
    { category: 'consistency', message: 'Schedule your study at the same time daily to build habit.', minProductivityScore: 0, maxProductivityScore: 100 },
    { category: 'breaks', message: 'Take a 5-minute walk between sessions to reset attention.', minProductivityScore: 30, maxProductivityScore: 100 },
    { category: 'general', message: 'Review yesterdays notes for 10 minutes before new material.', minProductivityScore: 0, maxProductivityScore: 100 }
  ]);

  console.log('Seeded demo data.');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
