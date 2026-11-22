// Mock of services/aiService.js — used by the booking suites until the Python
// prediction service is connected. It keeps the same public surface so the
// controllers can be tested without a running Python container.

const mock = {
  predictBooking: jest.fn(async () => ({
    predicted_duration_minutes: 24.5,
    no_show_probability: 0.72,
    risk_level: 'high',
    model_version: 'duration-v1.0.0-no-show-v1.0.0',
    feature_schema_version: 'booking-features-v1',
    predicted_at: new Date().toISOString(),
    correlation_id: 'pred-test-123',
    warnings: [],
    data_quality: { used_fallback_features: false, missing_optional_fields: [] }
  })),
  healthCheck: jest.fn(async () => ({ healthy: true, versions: ['duration-v1.0.0-no-show-v1.0.0'] })),
  AIServiceError: class AIServiceError extends Error {
    constructor(type, message, cause) {
      super(message);
      this.name = 'AIServiceError';
      this.type = type;
      this.cause = cause;
    }
  }
};

module.exports = mock;
