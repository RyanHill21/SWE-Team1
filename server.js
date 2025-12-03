import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import analyticsRouter from './routes/analytics.js';
import tipsRouter from './routes/tips.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartstudy';
const PORT = process.env.PORT || 4005;

mongoose.connect(MONGODB_URI).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB error', err);
});

app.get('/', (_req, res) => res.json({ ok: true, service: 'analytics' }));

app.use('/analytics', analyticsRouter);
app.use('/tips', tipsRouter);

app.listen(PORT, () => console.log(`Analytics service running on http://localhost:${PORT}`));
