const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    portfolio_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DoctorPortfolio',
      required: true
    },
    feedback: {
      type: String,
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  },
  {
    timestamps: true
  }
);

reviewSchema.index({ user_id: 1 });
reviewSchema.index({ portfolio_id: 1 });

module.exports = mongoose.model('Review', reviewSchema);
