const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Authenticate user and get JWT
router.post('/login', authController.login);

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', authenticateToken, authController.getMe);

// @route   POST /api/auth/demo/:role
// @desc    Quick 1-click login for Student or Admin
router.post('/demo/:role', authController.demoLogin);

module.exports = router;
