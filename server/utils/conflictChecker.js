const StudySession = require("../models/StudySession");

// returns true if there is any existing session for userId that overlaps [newStart, newEnd)
async function hasTimeConflict(userId, newStart, newEnd, excludeSessionId = null) {
    //Ensure Date Objects first
    const start = new Date(newStart);
    const end = new Date(newEnd);

    //if start >= end, it's invalid — treat that as a conflict to block bad data
    if (start >= end) return true;

    const query ={
        userId,
        $or: [
            { $and: [{ startTime: { $lt: end } }, { endTime: { $gt: start } }] },
        ],
    };

    if (excludeSessionId) query._id = { $ne: excludeSessionId };

    const overlapping = await StudySession.findOne(query).lean().exec();
    return !!overlapping;
}

module.exports = { hasTimeConflict };