const mongoose = require('mongoose');
const { isConnectedToMongo } = require('../config/db');
const { EmbeddedCollection } = require('./storeHelper');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ['lost', 'found'], required: true },
  category: { 
    type: String, 
    enum: ['Electronics', 'Accessories', 'Books', 'Clothing', 'ID & Cards', 'Other'],
    default: 'Other'
  },
  description: { type: String, required: true },
  location: { type: String, required: true },
  building: { 
    type: String, 
    enum: [
      'AB-1',
      'AB-2',
      'AB-3',
      'Central Library',
      'Dining Commons',
      'Sports Complex',
      'Student Hostels',
      'Main Gate & Parking',
      'Auditorium',
      'Robotics & Tech Lab',
      'Academic Block',
      'Other'
    ],
    default: 'AB-1'
  },
  floor: {
    type: String,
    enum: ['Ground', 'First', 'Second', 'Third'],
    default: 'Ground'
  },
  locationType: {
    type: String,
    enum: ['Classroom', 'Laboratory', 'Corridor', 'Library', 'Cafeteria', 'Other'],
    default: 'Classroom'
  },
  date: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['open', 'claim_pending', 'claimed', 'approved', 'received', 'resolved'], 
    default: 'open' 
  },
  handoverConfirmed: { type: Boolean, default: false },
  receivedAt: { type: String, default: '' },
  receivedConfirmedBy: { type: String, default: '' },
  receivedNotes: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  feedback: { type: String, default: '' },
  feedbackBy: { type: String, default: '' },
  feedbackSubmittedAt: { type: String, default: '' },
  finderRewarded: { type: Boolean, default: false },
  reportedBy: { type: String, required: true },
  reportedByName: { type: String, default: 'Campus Member' },
  contactEmail: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  secretDetails: { type: String, default: '' } // Identifying marks for verification
}, { timestamps: true });

let MongoItemModel;
try {
  MongoItemModel = mongoose.model('Item', itemSchema);
} catch (e) {
  MongoItemModel = mongoose.models.Item;
}

const embeddedItems = new EmbeddedCollection('items');

const Item = {
  create: async (data) => {
    return isConnectedToMongo() ? MongoItemModel.create(data) : embeddedItems.create(data);
  },
  insertMany: async (array) => {
    return isConnectedToMongo() ? MongoItemModel.insertMany(array) : embeddedItems.insertMany(array);
  },
  find: async (query = {}) => {
    return isConnectedToMongo() ? MongoItemModel.find(query).sort({ createdAt: -1 }) : embeddedItems.find(query);
  },
  findOne: async (query = {}) => {
    return isConnectedToMongo() ? MongoItemModel.findOne(query) : embeddedItems.findOne(query);
  },
  findById: async (id) => {
    return isConnectedToMongo() ? MongoItemModel.findById(id) : embeddedItems.findById(id);
  },
  findByIdAndUpdate: async (id, update, options) => {
    return isConnectedToMongo() ? MongoItemModel.findByIdAndUpdate(id, update, options) : embeddedItems.findByIdAndUpdate(id, update, options);
  },
  findByIdAndDelete: async (id) => {
    return isConnectedToMongo() ? MongoItemModel.findByIdAndDelete(id) : embeddedItems.findByIdAndDelete(id);
  },
  deleteMany: async (query) => {
    return isConnectedToMongo() ? MongoItemModel.deleteMany(query) : embeddedItems.deleteMany(query);
  },
  countDocuments: async (query) => {
    return isConnectedToMongo() ? MongoItemModel.countDocuments(query) : embeddedItems.countDocuments(query);
  }
};

module.exports = Item;
