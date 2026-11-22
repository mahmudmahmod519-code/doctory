// Global setup — runs ONCE before all the test suites.
// Makes sure the test environment variables are set before any module is required.

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_access_secret';
process.env.JWT_REFRESH_SECRET = 'test_jwt_refresh_secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.SALT_ROUNDS = '4'; // fast hashing for the tests

// The suites connect to this database and drop it in the teardown.
process.env.MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://127.0.0.1:27017/doctory_test';
process.env.LOG_DIR = 'logs';
process.env.LEVEL = 'error';

module.exports = async () => {
  // Nothing to prepare here — the database is connected in test/helpers/db.js.
};
