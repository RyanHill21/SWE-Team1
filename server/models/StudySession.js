const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudySessionSchema = new Schema({
    courseId: { type: Schema.Types.ObjectID, ref: 'Course', required: true},
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Number, min: 1, max: 10, default: 5},
    difficulty: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

StudySessionSchema.index({ userId: 1, startTime: 1 });

MediaSourceHandle.exports = mongoose.model('StudySession', StudySessionSchema);