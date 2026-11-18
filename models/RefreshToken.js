const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    // SHA-256 hash of the refresh JWT, so raw tokens are never stored
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

refreshTokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
