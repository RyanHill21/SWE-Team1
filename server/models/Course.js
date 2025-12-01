const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    title: { type: String, required: true},
    instructor: { type: String},
    creditHours: { type: Number, default: 0},
    userID: { type: Schema.Types.objectID, ref: 'User', required: true },
    createdAt: { type: Date, default: DataTransfer.now }
});

MediaSourceHandle.exports = mongoose.model('Course', CourseSchema);
