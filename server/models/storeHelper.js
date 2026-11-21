const { v4: uuidv4 } = require('crypto');
const { isConnectedToMongo, readEmbeddedDb, writeEmbeddedDb } = require('../config/db');

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

class EmbeddedCollection {
  constructor(collectionName) {
    this.name = collectionName;
  }

  _getAll() {
    const db = readEmbeddedDb();
    return db[this.name] || [];
  }

  _saveAll(items) {
    const db = readEmbeddedDb();
    db[this.name] = items;
    writeEmbeddedDb(db);
  }

  async create(data) {
    const items = this._getAll();
    const newItem = {
      _id: generateId(),
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    items.unshift(newItem);
    this._saveAll(items);
    return newItem;
  }

  async insertMany(array) {
    const items = this._getAll();
    const created = array.map(data => ({
      _id: generateId(),
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    items.unshift(...created);
    this._saveAll(items);
    return created;
  }

  async find(query = {}) {
    let items = this._getAll();
    return items.filter(item => matchQuery(item, query));
  }

  async findOne(query = {}) {
    const items = this._getAll();
    return items.find(item => matchQuery(item, query)) || null;
  }

  async findById(id) {
    if (!id) return null;
    const items = this._getAll();
    return items.find(item => item._id === id.toString()) || null;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const items = this._getAll();
    const index = items.findIndex(item => item._id === id.toString());
    if (index === -1) return null;

    const current = items[index];
    const updated = {
      ...current,
      ...update,
      updatedAt: new Date().toISOString()
    };
    items[index] = updated;
    this._saveAll(items);
    return options.new === false ? current : updated;
  }

  async findByIdAndDelete(id) {
    const items = this._getAll();
    const index = items.findIndex(item => item._id === id.toString());
    if (index === -1) return null;
    const removed = items.splice(index, 1)[0];
    this._saveAll(items);
    return removed;
  }

  async deleteMany(query = {}) {
    if (Object.keys(query).length === 0) {
      this._saveAll([]);
      return { deletedCount: 0 };
    }
    const items = this._getAll();
    const remaining = items.filter(item => !matchQuery(item, query));
    const deletedCount = items.length - remaining.length;
    this._saveAll(remaining);
    return { deletedCount };
  }

  async countDocuments(query = {}) {
    const matches = await this.find(query);
    return matches.length;
  }
}

function matchQuery(item, query) {
  for (const key of Object.keys(query)) {
    const filterVal = query[key];
    if (filterVal === undefined) continue;

    // Handle regex
    if (filterVal instanceof RegExp) {
      if (!filterVal.test(item[key] || '')) return false;
      continue;
    }

    // Handle MongoDB operators
    if (filterVal && typeof filterVal === 'object' && !Array.isArray(filterVal)) {
      if (filterVal.$regex) {
        const regex = new RegExp(filterVal.$regex, filterVal.$options || '');
        if (!regex.test(item[key] || '')) return false;
        continue;
      }
      if (filterVal.$in) {
        if (!filterVal.$in.includes(item[key])) return false;
        continue;
      }
      if (filterVal.$ne) {
        if (item[key] === filterVal.$ne) return false;
        continue;
      }
    }

    if (item[key] !== filterVal) {
      return false;
    }
  }
  return true;
}

module.exports = {
  EmbeddedCollection
};
