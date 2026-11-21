const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Determine database storage mode
let isMongoConnected = false;

// Embedded JSON database fallback
const possibleDataDirs = [
  path.join(__dirname, '../data'),
  path.join(__dirname, '../../data')
];
const DATA_DIR = possibleDataDirs.find(d => fs.existsSync(path.join(d, 'db.json'))) || path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const initialDbStructure = {
  users: [],
  items: [],
  claims: [],
  notifications: []
};

// Ensure data folder and file exist
function initEmbeddedDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDbStructure, null, 2));
  }
}

function readEmbeddedDb() {
  initEmbeddedDb();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading embedded db:', err);
    return { ...initialDbStructure };
  }
}

function writeEmbeddedDb(data) {
  initEmbeddedDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Connect to MongoDB with intelligent fallback
async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/saitrace';

  try {
    // Attempt Mongoose connection with 3-second timeout
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    isMongoConnected = true;
    console.log('[Database] MongoDB connected successfully');  } catch (err) {
    isMongoConnected = false;
    console.warn(`[Database] MongoDB unavailable (${err.message}).`);
    console.log('[Database] Activating high-performance resilient embedded file database (data/db.json).');
    initEmbeddedDb();
  }
}

function isConnectedToMongo() {
  return isMongoConnected;
}

module.exports = {
  connectDB,
  isConnectedToMongo,
  readEmbeddedDb,
  writeEmbeddedDb
};
