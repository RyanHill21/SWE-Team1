const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/courseController')

router.post('/create', auth, controller.createCourse);
router.get('/', auth, controller.getCourse);
router.put('/:id', auth, controller.updateCourse);
router.delete('/:id', auth, controller.deleteCourse);

module.exports = router;