const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actor_id: {
      type: String,
      required: true,
      trim: true
    },
    actor_role: {
      type: String,
      required: true,
      trim: true
    },
    action: {
      type: String,
      required: true,
      trim: true
    },
    entity_type: {
      type: String,
      required: true,
      trim: true
    },
    entity_id: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    ip: {
      type: String,
      trim: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

auditLogSchema.index({ actor_id: 1 });
auditLogSchema.index({ actor_role: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ entity_type: 1, entity_id: 1 });
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
