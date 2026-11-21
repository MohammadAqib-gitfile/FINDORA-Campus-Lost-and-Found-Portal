const express = require('express');
const router = express.Router();
const heroesController = require('../controllers/heroesController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// @route   GET /api/heroes/leaderboard
// @desc    Get the active weekly leaderboard
router.get('/leaderboard', heroesController.getLeaderboard);

// @route   GET /api/heroes/stats
// @desc    Get campus-wide reward and feedback metrics
router.get('/stats', heroesController.getHeroesStats);

// @route   GET /api/heroes/admin/logs
// @desc    Admin audit log of all reward transactions
router.get('/admin/logs', authenticateToken, requireAdmin, heroesController.getRewardAuditLogs);

module.exports = router;
