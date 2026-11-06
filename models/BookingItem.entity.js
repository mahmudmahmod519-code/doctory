const mongoose = require('mongoose');

const bookingItemSchema = new mongoose.Schema(
  {
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    work_id: {
      type: String,
      trim: true,
      index: true
    },
    service_type: {
      type: String,
      trim: true
    },
    visit_reason_category: {
      type: String,
      trim: true
    },
    problem_description: {
      type: String,
      trim: true,
      maxLength: 1000
    },
    chronic_conditions: {
      type: Map,
      of: Boolean,
      default: {}
    },
    queue_number: {
      type: Number,
      required: true
    },
    patient_name: {
      type: String,
      trim: true
    },
    patient_phone: {
      type: String,
      trim: true
    },
    patient_age: {
      type: Number
    },
    patient_address: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
      trim: true
    },
    type: {
      type: String,
      required: true,
      enum: ['booking', 'consulting'],
      trim: true
    },
    qr_code: {
      type: String,
      trim: true
    },
    completed_at: {
      type: Date,
      default: null
    },
    deleted_at: {
      type: Date,
      default: null
    },
    // --- AI Scheduling Prediction fields ---
    prediction: {
      status: {
        type: String,
        enum: ['available', 'fallback', 'failed'],
        default: 'failed',
        trim: true
      },
      correlation_id: {
        type: String,
        trim: true,
        index: true
      },
      predicted_duration_minutes: {
        type: Number,
        min: 0
      },
      no_show_probability: {
        type: Number,
        min: 0,
        max: 1
      },
      risk_level: {
        type: String,
        enum: ['normal', 'high'],
        default: 'normal',
        trim: true
      },
      model_version: {
        type: String,
        trim: true
      },
      feature_schema_version: {
        type: String,
        trim: true
      },
      predicted_at: {
        type: Date
      },
      data_quality: {
        used_fallback_features: {
          type: Boolean,
          default: false
        },
        missing_optional_fields: {
          type: [String],
          default: []
        }
      }
    },
    confirmation_required: {
      type: Boolean,
      default: false
    },
    deposit_required: {
      type: Boolean,
      default: false
    },
    reminder_state: {
      type: String,
      enum: ['none', 'sent', 'confirmed', 'declined'],
      default: 'none',
      trim: true
    },
    // --- Actual outcomes (for retraining) ---
    rescheduled_from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookingItem',
      trim: true
    },
    actual_started_at: {
      type: Date,
      default: null
    },
    actual_ended_at: {
      type: Date,
      default: null
    },
    actual_duration_minutes: {
      type: Number,
      min: 0
    },
    no_show: {
      type: Boolean,
      default: false
    },
    consent_version: {
      type: String,
      trim: true
    },
    consent_at: {
      type: Date
    },
    // ---------------------------------------
  },
  {
    timestamps: true
  }
);

bookingItemSchema.index({ booking_id: 1 });
bookingItemSchema.index({ user_id: 1 });
bookingItemSchema.index({ status: 1 });
bookingItemSchema.index({ booking_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('BookingItem', bookingItemSchema);
