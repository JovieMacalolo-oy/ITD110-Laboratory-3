const express = require('express');
const router = express.Router();
const {
    getSchedules,
    createSchedule,
    deleteSchedule
} = require('../controllers/scheduleController');

// Standard routes for Schedules
router.route('/')
    .get(getSchedules)
    .post(createSchedule);

// Delete route using the Schedule node ID
router.route('/:id')
    .delete(deleteSchedule);

module.exports = router;