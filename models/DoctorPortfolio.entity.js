const mongoose = require('mongoose');

const doctorPortfolioSchema = new mongoose.Schema(
  {
    portfolio_id: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    doctor_name: {
      type: String,
      required: true,
      trim: true
    },
    specialty: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      trim: true
    },
    background_image: {
      type: String,
      trim: true
    },
    profile_image: {
      type: String,
      trim: true
    },
    phone_number: {
      type: String,
      trim: true
    },
    working_hours: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

doctorPortfolioSchema.index({ user_id: 1 });
doctorPortfolioSchema.index({ portfolio_id: 1 });
doctorPortfolioSchema.index({ specialty: 1 });

module.exports = mongoose.model('DoctorPortfolio', doctorPortfolioSchema);
