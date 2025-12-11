const express = require('express');
const router = express.Router();
const { auth, isHR } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get('/', auth, userController.getAllUsers);
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, isHR, userController.updateUser); // Only HR can update details

module.exports = router;