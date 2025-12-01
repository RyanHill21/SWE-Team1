const express = require('express');
const router = express.Router();
const auth = require('../middlesware/auth');
const controller = require('../controllers/courseController')

router.post('/create', auth, controller.creatCourse);
router.get('/', auth, controller.getCourse);
router.put('/:id', auth, controller.updateCourses);
router.delete('/:id', auth, controller.deleteCourse);

module.exports = router;