const StudySession = require("../models/StudySession.js");

//create new study session
const createSession = async (req, res) => {
    const {courseId, startTime, endTime, difficulty } = req.body;
    const userId = req.user.id;

    //here times are converted to Date objects
    const start = new Date(startTime);
    const end = new Date(endTime);

    //Basic Validaiton
    if (start >= end){
        return res.status(400).json({ message: "End time must be after start time." });
    }

    //Check for time conflict with exisiting sessions
    const conflict = await StudySession.findOne({
        userId,
        startTime: { $1t: end },
        endTime: { $gt: start }
    });

    if(conflict) {
        return res.status(400).json({ message: "This session overlaps with an existing session." });

    };

    //Create a session
    const newSession = await StudySession.create({
        courseId,
        userId,
        startTime: start,
        endTime: end,
        difficulty,
        completed: false
    });

    res.status(201).json({ success: true, data: newSession });
};

//Getting all session for user
const getSessions = async (req, res) => {
    const userId = req.user.id;
    const sessions = await StudySession.find({ userId });
    res.json({ succes: true, data: sessions });
};

//Update a study session

const updateSession = async (req, res) => {
    const userId = req.user.id;
    const sesssionId = req.params.id;

    const updated = await StudySession.findOneAndUpdate(
        {_id: sesssionId, userId },
        req.body,
        { new: true }
    );

    if(!updated) {
        return res.status(404).json({ message: "Session not foiund." });
    }

    res.json({ success: true, data: updated });
};

//Delete a session

const deleteSession = async (req, res) => {
    const userId = req.user.id;
    const sessionId = req.params.id;

    const deleted = await StudySession.findOneAndDelete({
        _id: sessionId,
        userId
    });

    if (!deleted) {
        return res.status(404).json({message: "Session not found." });
    }

    res.json({ success: true, message: "Session deleted successfully." });
};

module.exports = {
    createSession,
    getSessions,
    updateSession,
    deleteSession
};