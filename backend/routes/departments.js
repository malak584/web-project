const express = require('express');
const router = express.Router();
const { auth, isHR } = require('../middleware/auth');
const deptController = require('../controllers/departmentController');

router.get('/', auth, deptController.getAllDepartments);
router.post('/', auth, isHR, deptController.createDepartment);
router.post('/add-employee', auth, isHR, deptController.addEmployeeToDepartment);

module.exports = router;