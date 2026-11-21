const mongoose = require('mongoose');
const { isConnectedToMongo } = require('../config/db');
const { EmbeddedCollection } = require('./storeHelper');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  campusId: { type: String, default: '' },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  points: { type: Number, default: 0 },
  weeklyPoints: { type: Number, default: 0 },
  returnsCount: { type: Number, default: 0 },
  ratingsCount: { type: Number, default: 0 },
  totalRatingPoints: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0.0 },
  badge: { type: String, default: 'Helpful Student' },
  badges: { type: [String], default: ['Helpful Student'] },
  rewardHistory: { type: Array, default: [] },
  lastWeeklyReset: { type: String, default: '' }
}, { timestamps: true });

let MongoUserModel;
try {
  MongoUserModel = mongoose.model('User', userSchema);
} catch (e) {
  MongoUserModel = mongoose.models.User;
}

const embeddedUsers = new EmbeddedCollection('users');

const User = {
  create: async (data) => {
    return isConnectedToMongo() ? MongoUserModel.create(data) : embeddedUsers.create(data);
  },
  find: async (query = {}) => {
    return isConnectedToMongo() ? MongoUserModel.find(query) : embeddedUsers.find(query);
  },
  findOne: async (query = {}) => {
    return isConnectedToMongo() ? MongoUserModel.findOne(query) : embeddedUsers.findOne(query);
  },
  findById: async (id) => {
    return isConnectedToMongo() ? MongoUserModel.findById(id) : embeddedUsers.findById(id);
  },
  findByIdAndUpdate: async (id, update, options) => {
    return isConnectedToMongo() ? MongoUserModel.findByIdAndUpdate(id, update, options) : embeddedUsers.findByIdAndUpdate(id, update, options);
  },
  deleteMany: async (query) => {
    return isConnectedToMongo() ? MongoUserModel.deleteMany(query) : embeddedUsers.deleteMany(query);
  },
  countDocuments: async (query) => {
    return isConnectedToMongo() ? MongoUserModel.countDocuments(query) : embeddedUsers.countDocuments(query);
  }
};

module.exports = User;
