const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema(
  {
    // SHA-256 hash of the JWT, so raw tokens are never stored
    token_hash: {
      type: String,
      required: true,
      unique: true
    },
    // Same as the JWT expiry; MongoDB removes the document automatically after this date
    expires_at: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

tokenBlacklistSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('TokenBlacklist', tokenBlacklistSchema);
