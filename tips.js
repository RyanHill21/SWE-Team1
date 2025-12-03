import { Router } from 'express';
import mongoose from 'mongoose';
import Analytics from '../models/Analytics.js';
import Tip from '../models/Tip.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Valid userId is required' });
    }

    const a = await Analytics.findOne({ userId }).lean();
    const score = a?.productivityScore ?? 0;

    const tips = await Tip.find({
      minProductivityScore: { $lte: score },
      maxProductivityScore: { $gte: score }
    }).limit(5).lean();

    const payload = tips.length ? tips : await Tip.find().limit(3).lean();

    res.json({ userId, score, tips: payload.map(t => ({ category: t.category, message: t.message })) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
