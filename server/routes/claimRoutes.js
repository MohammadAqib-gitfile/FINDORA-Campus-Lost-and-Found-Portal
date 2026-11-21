const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   POST /api/claims
// @desc    Submit a claim for an item
router.post('/', authenticateToken, upload.single('proofImage'), claimController.submitClaim);

// @route   GET /api/claims/my-claims
// @desc    Get claims submitted by current user
router.get('/my-claims', authenticateToken, claimController.getMyClaims);

// @route   GET /api/claims/admin/all
// @desc    Get all claims (Admin only)
router.get('/admin/all', authenticateToken, requireAdmin, claimController.getAllClaims);

// @route   GET /api/claims/item/:itemId
// @desc    Get claims for a specific item (Owner or Admin)
router.get('/item/:itemId', authenticateToken, claimController.getClaimsForItem);

// @route   PATCH /api/claims/:claimId/status
// @desc    Approve or reject a claim (Owner or Admin)
router.patch('/:claimId/status', authenticateToken, claimController.updateClaimStatus);

// @route   PATCH /api/claims/:claimId/handover
// @desc    Confirm item handover and mark item Received (Owner or Admin)
router.patch('/:claimId/handover', authenticateToken, claimController.confirmHandover);

// @route   POST /api/claims/:claimId/feedback
// @desc    Submit verified feedback/rating for completed return (Claimant only)
router.post('/:claimId/feedback', authenticateToken, claimController.submitFeedback);

module.exports = router;
