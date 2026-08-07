const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /api/users/login - Authenticate user
router.post('/login', userController.loginUser);

// POST /api/users/register - Register a new user
router.post('/register', userController.registerUser);

module.exports = router;
