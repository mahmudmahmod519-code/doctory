// Database helpers for the integration and e2e suites.
// Connects Mongoose to the test database and provides a clean-state helper.

const mongoose = require('mongoose');
const config = require('../../config/env-config');

async function connect() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  const uri = process.env.TEST_MONGO_URI || 'mongodb://127.0.0.1:27017/doctory_test';
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000
  });
  return mongoose.connection;
}

async function disconnect() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
}

/** Removes every document of every collection. */
async function clear() {
  if (mongoose.connection.readyState !== 1) return;
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
}

/** Drops the whole test database. */
async function drop() {
  if (mongoose.connection.readyState !== 1) return;
  await mongoose.connection.dropDatabase();
}

module.exports = { connect, disconnect, clear, drop, mongoose };
