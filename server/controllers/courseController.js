const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
    try {
        const { title, instructor, creditHours } = req.body;
        const userId = req.user.id;
        const course = new Course ({ title, instructor, creditHours, userId })
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const course = await Course.findOneAndUpdate({ _id: id, userId }, req.body, { new: true });
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);

    } catch (err){
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteCourse = async (req,res) => {
    try{
        const { id } = req.params;
        const userId = req.user.id;
        const course = await Course.findOneAndDelete({ _id: id, userId});
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json({ message: 'Course deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getCourse = async (req, res) => {
    try{
        const userId = req.user.id;
        const courses = await Course.find({ userId });
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}