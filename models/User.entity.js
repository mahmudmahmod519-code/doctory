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

userSchema.index({ user_id: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

module.exports = mongoose.model('User', userSchema);
