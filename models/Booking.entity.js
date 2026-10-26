const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    portfolio_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DoctorPortfolio',
      required: true
    },
    total_patients: {
      type: Number,
      required: true,
      default: 50
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'active', 'expired', 'cancelled'],
      default: 'pending',
      trim: true
    },
    appointment_date: {
      type: Date,
      required: true
    },
    appointment_time: {
      type: String,
      required: true,
      trim: true
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

bookingSchema.index({ portfolio_id: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ appointment_date: 1 });
bookingSchema.index({ portfolio_id: 1, appointment_date: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
