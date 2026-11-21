const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

// @route   GET /api/notifications
// @desc    Get user notifications
router.get('/', authenticateToken, notificationController.getMyNotifications);

// @route   PATCH /api/notifications/:id/read
// @desc    Mark a notification as read
router.patch('/:id/read', authenticateToken, notificationController.markAsRead);

// @route   PATCH /api/notifications/read-all
// @desc    Mark all notifications as read
router.patch('/read-all', authenticateToken, notificationController.markAllAsRead);

module.exports = router;
