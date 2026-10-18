const mongoose = require('mongoose');

const deletionRequestSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      trim: true
    },
    reason: {
      type: String,
      trim: true
    },
    reviewed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewed_at: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

deletionRequestSchema.index({ user_id: 1 });
deletionRequestSchema.index({ status: 1 });

module.exports = mongoose.model('DeletionRequest', deletionRequestSchema);
