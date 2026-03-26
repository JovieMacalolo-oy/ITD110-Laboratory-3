const express = require('express');
const router = express.Router();
const {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
} = require('../controllers/departmentController');

// Standard routes for Departments
router.route('/')
    .get(getDepartments)
    .post(createDepartment);

// ID-specific routes (for Editing and Deleting)
router.route('/:id')
    .put(updateDepartment)
    .delete(deleteDepartment);

module.exports = router;