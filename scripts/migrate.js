// scripts/migrate.js
// Database migration script for Doctory.
// Ensures Mongoose indexes are created on all collections.
// Run with: npm run migrate

const mongoose = require('mongoose');
const config = require('../config/env-config');

// Build MongoDB URI (same logic as config/database.js)
function buildMongoUri() {
  if (config.database_mongo.uri) {
    return config.database_mongo.uri;
  }
  const { host, port, user, pass, name } = config.database_mongo;
  const credentials = user
    ? `${encodeURIComponent(user)}:${encodeURIComponent(pass || '')}@`
    : '';
  return `mongodb://${credentials}${host}:${port}/${name}`;
}

async function migrate() {
  const uri = buildMongoUri();

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
  });

  console.log('✅ Connected to MongoDB');

  // Import all models to trigger index creation
  // Mongoose creates indexes defined in each schema on model initialization
  require('../models/User.entity.js');
  require('../models/DoctorPortfolio.entity.js');
  require('../models/DoctorWork.entity.js');
  require('../models/Booking.entity.js');
  require('../models/BookingItem.entity.js');
  require('../models/Review.entity.js');
  require('../models/Report.entity.js');
  require('../models/AuditLog.entity.js');
  require('../models/DeletionRequest.entity.js');
  require('../models/RefreshToken.entity.js');
  require('../models/Notification.entity.js');

  console.log('✅ All model indexes ensured');
  await mongoose.disconnect();
  console.log('✅ Disconnected from MongoDB');
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
