const Notification = require('../models/Notification');

// Get notifications for current user
async function getMyNotifications(req, res, next) {
  try {
    const notifications = await Notification.find({ userId: req.user.id });
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      notifications
    });
  } catch (err) {
    next(err);
  }
}

// Mark single notification as read
async function markAsRead(req, res, next) {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found.'
      });
    }

    if (notification.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden.'
      });
    }

    const updated = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });

    return res.status(200).json({
      success: true,
      notification: updated
    });
  } catch (err) {
    next(err);
  }
}

// Mark all notifications as read
async function markAllAsRead(req, res, next) {
  try {
    const notifications = await Notification.find({ userId: req.user.id, isRead: false });
    for (const notif of notifications) {
      await Notification.findByIdAndUpdate(notif._id, { isRead: true });
    }

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead
};
