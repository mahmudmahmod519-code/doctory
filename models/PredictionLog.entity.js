const mongoose = require('mongoose');

const predictionLogSchema = new mongoose.Schema(
  {
    correlation_id: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    booking_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookingItem',
      trim: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    doctor_id: {
      type: String,
      trim: true
    },
    feature_schema_version: {
      type: String,
      required: true,
      trim: true
    },
    model_version: {
      type: String,
      required: true,
      trim: true
    },
    features: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    response: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    status: {
      type: String,
      enum: ['available', 'fallback', 'failed'],
      required: true,
      default: 'failed',
      trim: true
    },
    latency_ms: {
      type: Number,
      required: true
    },
    error_message: {
      type: String,
      trim: true
    },
    created_at: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

predictionLogSchema.index({ correlation_id: 1 }, { unique: true });
predictionLogSchema.index({ user_id: 1, created_at: -1 });
predictionLogSchema.index({ booking_item_id: 1 });

module.exports = mongoose.model('PredictionLog', predictionLogSchema);
