// Per-suite setup — runs before EVERY test file.
// Keeps the console quiet and gives a clean starting point for the assertions.

const mongoose = require('mongoose');

// Fail fast when a test forgets to clean the database.
afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key of Object.keys(collections)) {
      await collections[key].deleteMany({});
    }
  }
});

jest.setTimeout(30000);
