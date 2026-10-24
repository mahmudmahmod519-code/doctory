const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    notification_id: {
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
    type: {
      type: String,
      required: true,
      enum: [
        'queue_update',
        'booking_accepted',
        'booking_rejected',
        'turn_warning',
        'appointment_cancelled',
        'doctor_verified',
        'deletion_request_update',
        'system'
      ],
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    is_read: {
      type: Boolean,
      default: false
    },
    related_entity_type: {
      type: String,
      trim: true
    },
    related_entity_id: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

// ============================================================================
// NOTIFICATION POLICY
// ----------------------------------------------------------------------------
// - No SMS notifications.
// - No paid third-party SMS gateways (Twilio, Vonage, MessageBird, etc.).
// - In-App notifications only for normal events (queue updates, booking
//   accept/reject, turn warnings, cancellation, doctor verification, deletion
//   request updates, system notices).
// - Email (Nodemailer) may be added later, and only for critical events:
//   email verification, forgot password, doctor verification approve/reject,
//   final booking accept/reject, and data deletion request response.
// - Every write to this collection must go through the notification service
//   so the policy stays in one place.
// ============================================================================

notificationSchema.index({ user_id: 1 });
notificationSchema.index({ is_read: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ user_id: 1, is_read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
