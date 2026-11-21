const mongoose = require('mongoose');
const { isConnectedToMongo } = require('../config/db');
const { EmbeddedCollection } = require('./storeHelper');

const claimSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  itemTitle: { type: String, required: true },
  claimantId: { type: String, required: true },
  claimantName: { type: String, required: true },
  claimantEmail: { type: String, required: true },
  contactPhone: { type: String, default: '' },
  proofDescription: { type: String, required: true },
  proofImageUrl: { type: String, default: '' },
  verificationAnswer: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  isReceived: { type: Boolean, default: false },
  receivedAt: { type: String, default: '' },
  rating: { type: Number, default: null },
  feedback: { type: String, default: '' },
  feedbackSubmittedAt: { type: String, default: '' },
  reviewNotes: { type: String, default: '' },
  reviewedBy: { type: String, default: '' }
}, { timestamps: true });

let MongoClaimModel;
try {
  MongoClaimModel = mongoose.model('Claim', claimSchema);
} catch (e) {
  MongoClaimModel = mongoose.models.Claim;
}

const embeddedClaims = new EmbeddedCollection('claims');

const Claim = {
  create: async (data) => {
    return isConnectedToMongo() ? MongoClaimModel.create(data) : embeddedClaims.create(data);
  },
  insertMany: async (array) => {
    return isConnectedToMongo() ? MongoClaimModel.insertMany(array) : embeddedClaims.insertMany(array);
  },
  find: async (query = {}) => {
    return isConnectedToMongo() ? MongoClaimModel.find(query).sort({ createdAt: -1 }) : embeddedClaims.find(query);
  },
  findOne: async (query = {}) => {
    return isConnectedToMongo() ? MongoClaimModel.findOne(query) : embeddedClaims.findOne(query);
  },
  findById: async (id) => {
    return isConnectedToMongo() ? MongoClaimModel.findById(id) : embeddedClaims.findById(id);
  },
  findByIdAndUpdate: async (id, update, options) => {
    return isConnectedToMongo() ? MongoClaimModel.findByIdAndUpdate(id, update, options) : embeddedClaims.findByIdAndUpdate(id, update, options);
  },
  findByIdAndDelete: async (id) => {
    return isConnectedToMongo() ? MongoClaimModel.findByIdAndDelete(id) : embeddedClaims.findByIdAndDelete(id);
  },
  deleteMany: async (query) => {
    return isConnectedToMongo() ? MongoClaimModel.deleteMany(query) : embeddedClaims.deleteMany(query);
  },
  countDocuments: async (query) => {
    return isConnectedToMongo() ? MongoClaimModel.countDocuments(query) : embeddedClaims.countDocuments(query);
  }
};

module.exports = Claim;
