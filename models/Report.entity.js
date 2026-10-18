const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
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
    description: {
      type: String,
      trim: true
    },
    medicines: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

reportSchema.index({ user_id: 1 });
reportSchema.index({ portfolio_id: 1 });

module.exports = mongoose.model('Report', reportSchema);
