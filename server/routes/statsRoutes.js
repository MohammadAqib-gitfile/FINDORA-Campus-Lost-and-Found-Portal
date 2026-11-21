const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// @route   GET /api/stats/dashboard
// @desc    Get dashboard metrics, chart trends, and category distribution
router.get('/dashboard', statsController.getDashboardStats);

module.exports = router;
