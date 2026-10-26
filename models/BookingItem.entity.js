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
    }
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
