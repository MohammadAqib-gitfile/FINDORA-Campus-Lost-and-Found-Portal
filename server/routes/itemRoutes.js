const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/items
// @desc    Get all items with search, category, building, and sort filters
router.get('/', itemController.getItems);

// @route   GET /api/items/match-suggestions
// @desc    Get smart duplicate/match suggestions
router.get('/match-suggestions', itemController.getMatchSuggestions);

// @route   GET /api/items/received
// @desc    Get all received and returned items
router.get('/received', itemController.getReceivedItems);

// @route   GET /api/items/my-items
// @desc    Get items reported by current user
router.get('/my-items', authenticateToken, itemController.getMyItems);

// @route   GET /api/items/:id
// @desc    Get single item by ID
router.get('/:id', itemController.getItemById);

// @route   POST /api/items
// @desc    Report new lost or found item
router.post('/', optionalAuth, upload.single('image'), itemController.createItem);

// @route   PUT /api/items/:id
// @desc    Update item
router.put('/:id', authenticateToken, upload.single('image'), itemController.updateItem);

// @route   DELETE /api/items/:id
// @desc    Delete item
router.delete('/:id', authenticateToken, itemController.deleteItem);

module.exports = router;
