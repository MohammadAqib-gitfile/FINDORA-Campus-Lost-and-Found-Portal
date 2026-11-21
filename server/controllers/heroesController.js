const User = require('../models/User');
const Item = require('../models/Item');
const Claim = require('../models/Claim');

// Get Monday of the current week (UTC)
function getMondayOfCurrentWeek() {
  const d = new Date();
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setUTCDate(diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
}

// Compute weekly points for a user from reward history
function calculateWeeklyPoints(user, mondayDate) {
  const history = user.rewardHistory || [];
  return history
    .filter(event => new Date(event.date) >= mondayDate)
    .reduce((sum, event) => sum + (event.points || 0), 0);
}

// GET /api/heroes/leaderboard
async function getLeaderboard(req, res, next) {
  try {
    const monday = getMondayOfCurrentWeek();
    const users = await User.find({ role: 'student' });

    // Sync weekly points dynamically based on current week's reward history
    const leaderboard = users.map(user => {
      const history = user.rewardHistory || [];
      const weeklyPoints = calculateWeeklyPoints(user, monday);
      const lifetimePoints = user.points || 0;
      const returnsCount = user.returnsCount || 0;
      const ratingsCount = user.ratingsCount || 0;
      const averageRating = user.averageRating || 0.0;

      return {
        id: user._id.toString(),
        name: user.name,
        campusId: user.campusId || '',
        avatar: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
        weeklyPoints,
        lifetimePoints,
        returnsCount,
        ratingsCount,
        averageRating,
        badge: user.badge || 'Helpful Student',
        badges: user.badges || ['Helpful Student']
      };
    });

    // Sort by weekly points descending, then lifetime points, then average rating
    leaderboard.sort((a, b) => {
      if (b.weeklyPoints !== a.weeklyPoints) return b.weeklyPoints - a.weeklyPoints;
      if (b.returnsCount !== a.returnsCount) return b.returnsCount - a.returnsCount;
      if (b.lifetimePoints !== a.lifetimePoints) return b.lifetimePoints - a.lifetimePoints;
      return b.averageRating - a.averageRating;
    });

    // Assign weekly titles based on rank and contribution
    leaderboard.forEach((member, index) => {
      if (index === 0 && member.weeklyPoints > 0) {
        member.weeklyTitle = 'Campus Hero';
      } else if (index < 3 && member.weeklyPoints >= 50) {
        member.weeklyTitle = 'Kindness Champion';
      } else if (member.weeklyPoints > 0 || member.lifetimePoints > 0) {
        member.weeklyTitle = 'Helpful Student';
      } else {
        member.weeklyTitle = 'Campus Contributor';
      }
      member.rank = index + 1;
    });

    return res.status(200).json({
      success: true,
      currentWeekStart: monday.toISOString().split('T')[0],
      totalHeroes: leaderboard.length,
      leaderboard
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/heroes/stats
async function getHeroesStats(req, res, next) {
  try {
    const users = await User.find({ role: 'student' });
    const items = await Item.find();
    const claims = await Claim.find();

    const returnedItems = items.filter(i => i.status === 'received' || i.handoverConfirmed).length;
    const totalPointsAwarded = users.reduce((sum, u) => sum + (u.points || 0), 0);

    const ratings = claims.filter(c => c.rating && c.rating > 0).map(c => c.rating);
    const avgRating = ratings.length > 0 
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 
      : 5.0;

    return res.status(200).json({
      success: true,
      stats: {
        returnedItems,
        totalPointsAwarded,
        totalHeroes: users.length,
        averageCampusRating: avgRating,
        totalRatingsSubmitted: ratings.length
      }
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/heroes/admin/logs (Admin only - review suspicious activity)
async function getRewardAuditLogs(req, res, next) {
  try {
    const users = await User.find();
    const allLogs = [];

    users.forEach(user => {
      const history = user.rewardHistory || [];
      history.forEach(event => {
        allLogs.push({
          userId: user._id.toString(),
          userName: user.name,
          userEmail: user.email,
          ...event
        });
      });
    });

    allLogs.sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.status(200).json({
      success: true,
      count: allLogs.length,
      logs: allLogs
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getLeaderboard,
  getHeroesStats,
  getRewardAuditLogs
};
