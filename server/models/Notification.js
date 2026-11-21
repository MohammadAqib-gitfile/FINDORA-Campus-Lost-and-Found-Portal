const mongoose = require('mongoose');
const { isConnectedToMongo } = require('../config/db');
const { EmbeddedCollection } = require('./storeHelper');

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['claim_submitted', 'claim_approved', 'claim_rejected', 'match_alert', 'system'], 
    default: 'system' 
  },
  link: { type: String, default: '' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

let MongoNotificationModel;
try {
  MongoNotificationModel = mongoose.model('Notification', notificationSchema);
} catch (e) {
  MongoNotificationModel = mongoose.models.Notification;
}

const embeddedNotifications = new EmbeddedCollection('notifications');

const Notification = {
  create: async (data) => {
    return isConnectedToMongo() ? MongoNotificationModel.create(data) : embeddedNotifications.create(data);
  },
  insertMany: async (array) => {
    return isConnectedToMongo() ? MongoNotificationModel.insertMany(array) : embeddedNotifications.insertMany(array);
  },
  find: async (query = {}) => {
    return isConnectedToMongo() ? MongoNotificationModel.find(query).sort({ createdAt: -1 }) : embeddedNotifications.find(query);
  },
  findOne: async (query = {}) => {
    return isConnectedToMongo() ? MongoNotificationModel.findOne(query) : embeddedNotifications.findOne(query);
  },
  findById: async (id) => {
    return isConnectedToMongo() ? MongoNotificationModel.findById(id) : embeddedNotifications.findById(id);
  },
  findByIdAndUpdate: async (id, update, options) => {
    return isConnectedToMongo() ? MongoNotificationModel.findByIdAndUpdate(id, update, options) : embeddedNotifications.findByIdAndUpdate(id, update, options);
  },
  deleteMany: async (query) => {
    return isConnectedToMongo() ? MongoNotificationModel.deleteMany(query) : embeddedNotifications.deleteMany(query);
  },
  countDocuments: async (query) => {
    return isConnectedToMongo() ? MongoNotificationModel.countDocuments(query) : embeddedNotifications.countDocuments(query);
  }
};

module.exports = Notification;
