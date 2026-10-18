const mongoose = require('mongoose');

const doctorWorkSchema = new mongoose.Schema(
  {
    work_id: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    portfolio_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DoctorPortfolio',
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'active', 'rejected'],
      default: 'pending',
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    price: {
      type: Number
    },
    description: {
      type: String,
      trim: true
    },
    duration_session: {
      type: Number,
      comment: 'Duration in minutes'
    },
    working_time: {
      type: String,
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

doctorWorkSchema.index({ portfolio_id: 1 });
doctorWorkSchema.index({ status: 1 });
doctorWorkSchema.index({ work_id: 1 });

module.exports = mongoose.model('DoctorWork', doctorWorkSchema);
