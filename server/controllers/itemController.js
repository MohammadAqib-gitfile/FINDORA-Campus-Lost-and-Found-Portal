const Item = require('../models/Item');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Calculate text/keyword similarity between two items
function calculateMatchScore(itemA, itemB) {
  let score = 0;
  
  // Must be opposite types (one lost, one found)
  if (itemA.type === itemB.type) return 0;

  // Category match (+40%)
  if (itemA.category && itemB.category && itemA.category.toLowerCase() === itemB.category.toLowerCase()) {
    score += 40;
  }

  // Campus building match (+30%)
  if (itemA.building && itemB.building && itemA.building.toLowerCase() === itemB.building.toLowerCase()) {
    score += 30;
  }

  // Tokenize titles and descriptions
  const tokenize = (text) => (text || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(w => w.length > 2);
  const wordsA = new Set([...tokenize(itemA.title), ...tokenize(itemA.description)]);
  const wordsB = new Set([...tokenize(itemB.title), ...tokenize(itemB.description)]);

  let common = 0;
  for (const word of wordsA) {
    if (wordsB.has(word)) common++;
  }

  const wordScore = Math.min(30, common * 10);
  score += wordScore;

  return Math.min(100, score);
}

// Get all items with search, filters, pagination, and sorting
async function getItems(req, res, next) {
  try {
    const { 
      search, 
      category, 
      type, 
      building, 
      floor,
      locationType,
      status, 
      sort 
    } = req.query;

    let items = await Item.find();

    // Filter by type (lost / found)
    if (type && type.toLowerCase() !== 'all') {
      items = items.filter(item => item.type.toLowerCase() === type.toLowerCase());
    }

    // Filter by category
    if (category && category.toLowerCase() !== 'all') {
      items = items.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by building (supports AB-1, AB-2, AB-3, Central Library, etc.)
    if (building && building.toLowerCase() !== 'all') {
      items = items.filter(item => (item.building || '').toLowerCase() === building.toLowerCase());
    }

    // Filter by floor (Ground, First, Second, Third)
    if (floor && floor.toLowerCase() !== 'all') {
      items = items.filter(item => (item.floor || 'Ground').toLowerCase() === floor.toLowerCase());
    }

    // Filter by specific location type (Classroom, Laboratory, Corridor, Library, Cafeteria, Other)
    if (locationType && locationType.toLowerCase() !== 'all') {
      items = items.filter(item => (item.locationType || 'Classroom').toLowerCase() === locationType.toLowerCase());
    }

    // Filter by status (open, claim_pending, claimed, approved, received, resolved)
    if (status && status.toLowerCase() !== 'all') {
      items = items.filter(item => (item.status || 'open').toLowerCase() === status.toLowerCase());
    }

    // Keyword search
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      items = items.filter(item => {
        const titleMatch = (item.title || '').toLowerCase().includes(q);
        const descMatch = (item.description || '').toLowerCase().includes(q);
        const locMatch = (item.location || '').toLowerCase().includes(q);
        const bldgMatch = (item.building || '').toLowerCase().includes(q);
        const catMatch = (item.category || '').toLowerCase().includes(q);
        const floorMatch = (item.floor || '').toLowerCase().includes(q);
        const typeMatch = (item.locationType || '').toLowerCase().includes(q);
        return titleMatch || descMatch || locMatch || bldgMatch || catMatch || floorMatch || typeMatch;
      });
    }

    // Sorting
    if (sort === 'oldest') {
      items.sort((a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date));
    } else if (sort === 'az') {
      items.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else {
      // Default: newest first
      items.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
    }

    return res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (err) {
    next(err);
  }
}

// Get single item by ID
async function getItemById(req, res, next) {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    // Find smart matches for this item
    const allItems = await Item.find();
    const matches = allItems
      .filter(other => other._id.toString() !== item._id.toString() && other.type !== item.type && other.status === 'open')
      .map(other => ({
        item: other,
        score: calculateMatchScore(item, other)
      }))
      .filter(m => m.score >= 40)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return res.status(200).json({
      success: true,
      item,
      potentialMatches: matches
    });
  } catch (err) {
    next(err);
  }
}

// Create new Lost or Found item
async function createItem(req, res, next) {
  try {
    const { 
      title, 
      type, 
      category, 
      description, 
      location, 
      building, 
      floor,
      locationType,
      date, 
      secretDetails, 
      contactEmail, 
      contactPhone 
    } = req.body;

    if (!title || !type || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Item title, type (lost/found), description, and location are required.'
      });
    }

    // Handle image file or URL
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl.trim();
    }

    const newItem = await Item.create({
      title: title.trim(),
      type: type.toLowerCase() === 'found' ? 'found' : 'lost',
      category: category || 'Other',
      description: description.trim(),
      location: location.trim(),
      building: building || 'AB-1',
      floor: floor || 'Ground',
      locationType: locationType || 'Classroom',
      date: date || new Date().toISOString().split('T')[0],
      imageUrl,
      status: 'open',
      reportedBy: req.user ? req.user.id : 'guest',
      reportedByName: req.user ? req.user.name : (req.body.reportedByName || 'Campus Member'),
      contactEmail: req.user ? req.user.email : (contactEmail || ''),
      contactPhone: contactPhone || '',
      secretDetails: secretDetails || ''
    });

    // Reward System: Award 5 points for reporting a found item
    if (req.user && newItem.type === 'found') {
      try {
        const reportingUser = await User.findById(req.user.id);
        if (reportingUser) {
          const history = reportingUser.rewardHistory || [];
          const alreadyRewarded = history.some(h => h.action === 'report_found' && h.itemId === newItem._id.toString());
          if (!alreadyRewarded) {
            const updatedHistory = [...history, {
              action: 'report_found',
              points: 5,
              itemId: newItem._id.toString(),
              itemTitle: newItem.title,
              date: new Date().toISOString(),
              reason: 'Reported a found campus item'
            }];
            await User.findByIdAndUpdate(reportingUser._id, {
              points: (reportingUser.points || 0) + 5,
              weeklyPoints: (reportingUser.weeklyPoints || 0) + 5,
              rewardHistory: updatedHistory
            });
            await Notification.create({
              userId: reportingUser._id.toString(),
              title: 'Hero Points Earned! (+5 pts)',
              message: `You earned 5 FINDORA Hero points for reporting found item "${newItem.title}".`,
              type: 'system',
              link: `/items/${newItem._id}`
            });
          }
        }
      } catch (rewardErr) {
        console.warn('Error awarding report points:', rewardErr);
      }
    }

    // Check for potential duplicate/match alerts with opposite items
    const allItems = await Item.find();
    const potentialMatches = allItems
      .filter(other => other._id.toString() !== newItem._id.toString() && other.type !== newItem.type && other.status === 'open')
      .map(other => ({
        item: other,
        score: calculateMatchScore(newItem, other)
      }))
      .filter(m => m.score >= 50);

    // If matches found and user logged in, notify user
    if (potentialMatches.length > 0 && req.user) {
      await Notification.create({
        userId: req.user.id,
        title: `Possible Match Found for "${newItem.title}"!`,
        message: `We found ${potentialMatches.length} existing listing(s) that match your report with high confidence.`,
        type: 'match_alert',
        link: `/items/${newItem._id}`
      });
    }

    return res.status(201).json({
      success: true,
      message: `${newItem.type.toUpperCase()} item reported successfully.`,
      item: newItem,
      matchesFound: potentialMatches.length
    });
  } catch (err) {
    next(err);
  }
}

// Update item (Owner or Admin)
async function updateItem(req, res, next) {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    // Permission check
    if (req.user.role !== 'admin' && item.reportedBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only edit your own listings.'
      });
    }

    const updates = { ...req.body };
    if (req.file) {
      updates.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await Item.findByIdAndUpdate(req.params.id, updates, { new: true });

    return res.status(200).json({
      success: true,
      message: 'Item updated successfully.',
      item: updated
    });
  } catch (err) {
    next(err);
  }
}

// Delete item (Owner or Admin)
async function deleteItem(req, res, next) {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }

    if (req.user.role !== 'admin' && item.reportedBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only delete your own listings.'
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Item deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
}

// Get listings created by current user
async function getMyItems(req, res, next) {
  try {
    const items = await Item.find({ reportedBy: req.user.id });
    return res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (err) {
    next(err);
  }
}

// Smart Match Check for any text or item
async function getMatchSuggestions(req, res, next) {
  try {
    const { title, category, location, building, type } = req.query;
    const oppositeType = type === 'lost' ? 'found' : 'lost';

    const items = await Item.find({ type: oppositeType, status: 'open' });
    const target = { title, category, location, building, type };

    const suggestions = items
      .map(item => ({
        item,
        score: calculateMatchScore(target, item)
      }))
      .filter(s => s.score >= 35)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      count: suggestions.length,
      suggestions
    });
  } catch (err) {
    next(err);
  }
}

// Get all received/returned items with handover records
async function getReceivedItems(req, res, next) {
  try {
    const { building, category, search } = req.query;
    let items = await Item.find();

    // Filter to items that are received, resolved, or have handover confirmed
    items = items.filter(item => 
      item.status === 'received' || 
      item.status === 'resolved' || 
      item.handoverConfirmed === true
    );

    if (building && building.toLowerCase() !== 'all') {
      items = items.filter(item => (item.building || '').toLowerCase() === building.toLowerCase());
    }

    if (category && category.toLowerCase() !== 'all') {
      items = items.filter(item => (item.category || '').toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      items = items.filter(item => 
        (item.title || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.location || '').toLowerCase().includes(q) ||
        (item.building || '').toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMyItems,
  getMatchSuggestions,
  getReceivedItems
};
