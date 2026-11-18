const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'doctor', 'patient'],
      trim: true
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'pending', 'suspended'],
      default: 'pending',
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    email_verified: {
      type: Boolean,
      default: false
    },
    password_hash: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    birth_date: {
      type: Date
    },
    image_profile: {
      type: String,
      trim: true
    },
    enable_2fa: {
      type: Boolean,
      default: false
    },
    token: {
      type: String,
      trim: true
    },
    secure_key: {
      type: String,
      trim: true
    },
    last_login: {
      type: Date
    },

    // Used by the Auth module to store the TOTP (authenticator app) secret
    secure_key: {
      type: String,
      trim: true
    },
    last_login: {
      type: Date
    },

    // ---- Added for the Auth module ----
    // Used by `protect` and refresh to reject tokens issued before the last password change
    password_changed_at: {
      type: Date
    },
    // Hashed one-time tokens from email links (never returned by default queries)
    password_reset_token: {
      type: String,
      select: false
    },
    password_reset_expires: {
      type: Date,
      select: false
    },
    email_verification_token: {
      type: String,
      select: false
    },
    email_verification_expires: {
      type: Date,
      select: false
    },
    // ------------------------------------


    deleted_at: {
      type: Date,
      default: null
    },
    deleted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// userSchema.index({ user_id: 1 });
// userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

module.exports = mongoose.model('User', userSchema);
